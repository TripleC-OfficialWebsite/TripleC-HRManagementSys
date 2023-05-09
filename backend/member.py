from flask import Blueprint
from flask import Flask, request,jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import ReturnDocument
from bson import ObjectId

memberAPI = Blueprint('member_api', __name__)

uri = "mongodb+srv://root:28GJiZtTYasykeil@cluster0.4lirrab.mongodb.net/?retryWrites=true&w=majority"

CORS(memberAPI)

# # Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tls=True,
                             tlsAllowInvalidCertificates=True)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.manageSys
member_collection = db['member']

test = member_collection

# either query by id or name
# or get all documents under member collection
@memberAPI.route("/member", methods=["GET"])
def get():
    data = []
    member_id = request.args.get('id')
    name = request.args.get('fullname')
    
    if member_id:
        query = {"_id": ObjectId(member_id)}
    elif name:
        query = {"fullname": name}
    else:
        for document in test.find({}, {"_id": 0}):
            data.append(document)
        return jsonify(data)
    member = test.find_one(query, {"_id": 0})
    if member:
        data.append(member)
        return jsonify(data)
    else:
        return jsonify({'error':f'Member {query} not found'}), 404

# given page number and limit, retrieve within range
# source of cursor:
#   https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor
@memberAPI.route("/member_range", methods=["GET"])
def getRange():
    data = []
    page_num = int(request.args.get('page'))
    limit = int(request.args.get('limit'))
    documents = test.find({}, {"_id": 0}) # type(documents) == cursor
    for document in documents.skip(page_num * limit).limit(limit):
        data.append(document)
    return jsonify(data)

# search with filter
@memberAPI.route("/member_search", methods=["GET"])
def search():
    data = []
    departments = request.args.get('department')
    projects = request.args.get('project')

    dept_pairs = departments.split(",")
    proj_pairs = projects.split(",")

    departments_data = {p.split(":")[0]:p.split(":")[1] for p in dept_pairs}
    projects_data = {p.split(":")[0]:p.split(":")[1] for p in proj_pairs}

    for dept,role in departments_data.items():
        document = test.find({"department": dept.upper(),"pos": role.title()}, {"_id": 0})
        for d in document:
            if d not in data:
                data.append(d)
    
    for proj,role in projects_data.items():
        document = test.find({"project_group": proj,"pos_group": role.title()}, {"_id": 0})
        for d in document:
            if d not in data:
                data.append(d)
    
    return jsonify(data)

# remove member by fullname
@memberAPI.route('/member_delete', methods=['DELETE'])
def removeMember():
    name = request.args.get('fullname')
    id = request.args.get('id')
    if not name and not id:
        return jsonify({'error': 'Missing fullname or id'}), 400
    if id:
        query = {"_id": ObjectId(id)}
    if name:
        query = {'fullname': name}
    result = test.delete_one(query)
    if result.deleted_count == 1:
        return jsonify({'success': f'Member {query} deleted successfully'}), 200
    else:
        return jsonify({'error': f'Member {query} not found'}), 404
    
# if not found, add insert a new document, else update the old one
@memberAPI.route("/member_add", methods=["POST"])
def addMember():
    id = request.args.get('id')
    name = request.args.get('fullname')

    data = request.args

    query = {"_id": ObjectId(id)} if id else {'fullname':name}
    queryBy = 'id' if id else 'fullname'

    update = {'$set':{key:value} for key,value in data.items() if key != queryBy}
    member = test.find_one_and_update(query,update,
                                        upsert=True,return_document=ReturnDocument.AFTER)
    member_id = str(member['_id'])
    
    return jsonify({'_id': member_id, 'status_code': 0})

# add member info from a local file
@memberAPI.route("/member_add_file", methods=["POST"])
def addMember_file():
    filename = request.args.get('filename')
    with open(filename, 'r') as reader:
        lines = reader.readlines()
        type = lines[0].split(",")
        lines = lines[1:]
        for l in lines:

            data = l.split(",")
            data = [d.strip() if len(d.strip())>0 else 'N/A' for d in data ]
            data = [data[i].title() if i == 2 or i == 4 or i == 8 else data[i] for i in range(len(data))]

            doc = dict(zip(type, data))
            if (test.find_one(doc) == None):
                test.insert_one(doc)

    return jsonify({'success': f'{filename} successfully loaded' })
    
# member_search?department=SWE:Member,PD:PD Chair&project=NutriPlan:backend
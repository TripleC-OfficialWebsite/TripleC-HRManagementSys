from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from pymongo import ReturnDocument



memberAPI = Blueprint('member_api', __name__)

# Create a new client and connect to the server
client = MongoClient("mongodb+srv://root:28GJiZtTYasykeil@cluster0.4lirrab.mongodb.net/?retryWrites=true&w=majority")
db = client.manageSys
member_collection = db.member

CORS(memberAPI)

# Check the MongoDB connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Retrieve all documents under member collection or query by ID or name
@memberAPI.route("/member", methods=["GET"])
def get():
    member_id = request.args.get('id')
    name = request.args.get('fullname')

    if member_id:
        query = {"_id": ObjectId(member_id)}
    elif name:
        query = {"fullname": name}
    else:
        # Retrieve all documents
        data = list(member_collection.find({}, {"_id": 0}))
        return jsonify(data)

    member = member_collection.find_one(query, {"_id": 0})
    if member:
        return jsonify([member])
    else:
        return jsonify({'error': f'Member {query} not found'}), 404

# Retrieve documents within the specified range
@memberAPI.route("/member_range", methods=["GET"])
def getRange():
    page_num = int(request.args.get('page'))
    limit = int(request.args.get('limit'))
    data = list(member_collection.find({}, {"_id": 0}).skip(page_num * limit).limit(limit))
    return jsonify(data)

# Retrieve documents matching the department/Project and role
@memberAPI.route("/member_search", methods=["GET"])
def search():
    departments = request.args.get('department')
    projects = request.args.get('project')

    dept_pairs = departments.split(",")
    proj_pairs = projects.split(",")

    departments_data = {p.split(":")[0]: p.split(":")[1] for p in dept_pairs}
    projects_data = {p.split(":")[0]: p.split(":")[1] for p in proj_pairs}

    data = []
    for dept, role in departments_data.items():
        documents = member_collection.find({"department": dept.upper(), "pos": role.title()}, {"_id": 0})
        data.extend(documents)

    for proj, role in projects_data.items():
        documents = member_collection.find({"project_group": proj, "pos_group": role.title()}, {"_id": 0})
        data.extend(documents)

    return jsonify(data)

# Remove a member by fullname or id
@memberAPI.route('/member_delete', methods=['DELETE'])
def removeMember():
    # request.json - json type
    name = request.args.get('fullname')
    member_id = request.args.get('id')

    if not name and not member_id:
        return jsonify({'error': 'Missing fullname or id'}), 400

    if member_id:
        query = {"_id": ObjectId(member_id)}
    elif name:
        query = {'fullname': name}

    result = member_collection.delete_one(query)
    if result.deleted_count == 1:
        return jsonify({'success': f'Member {query} deleted successfully'}), 200
    else:
        return jsonify({'error': f'Member {query} not found'}), 404
    
 # If the member is not found, insert a new document; otherwise, update the existing one
@memberAPI.route("/member_add", methods=["POST"])
def addMember():
    member_id = request.args.get('id')
    fullname = request.args.get('fullname')

    data = request.args

    query = {"_id": ObjectId(member_id)} if member_id else {'fullname': fullname}
    queryBy = 'id' if member_id else 'fullname'

    update = {'$set': {key: value} for key, value in data.items() if key != queryBy}

    member = member_collection.find_one_and_update(query, update, upsert=True, return_document=ReturnDocument.AFTER)
    member_id = str(member['_id'])
    
    return jsonify({'_id': member_id, 'status_code': 0})


# Add member info from a local file
@memberAPI.route("/member_add_file", methods=["POST"])
def addMember_file():
    filename = request.args.get('filename')

    with open(filename, 'r') as reader:
        lines = reader.readlines()
        header = lines[0].split(",")
        lines = lines[1:]  # Skip the header row

        for line in lines:
            data = line.split(",")
            data = [d.strip() if len(d.strip()) > 0 else 'N/A' for d in data]
            data = [data[i].title() if i == 2 or i == 4 or i == 8 else data[i] for i in range(len(data))]

            doc = dict(zip(header, data))

            if member_collection.find_one(doc) is None:
                member_collection.insert_one(doc)
            # else: 

    return jsonify({'success': f'{filename} successfully loaded'})

# member_search?department=SWE:Member,PD:PD Chair&project=NutriPlan:backend
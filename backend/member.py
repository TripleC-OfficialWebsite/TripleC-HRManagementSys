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

@memberAPI.route("/member", methods=["GET"])
def get():
    data = []
    member_id = request.args.get('id')
    if member_id:
        member = test.find_one({"_id": ObjectId(member_id)}, {"_id": 0})
        if member:
            data.append(member)
    else:
        for document in test.find({}, {"_id": 0}):
            data.append(document)

    return jsonify(data)
## use find_one to validate every document and delete the corresponding document
@memberAPI.route('/member_delete', methods=['DELETE'])
def removeMember():
    key = request.args.get('username')
    if not key:
        return jsonify({'error': 'Missing username'}), 400
    query = {'username': key}
    result = test.delete_one(query)
    if result.deleted_count == 1:
        return jsonify({'success': f'Admin {key} deleted successfully'}), 200
    else:
        return jsonify({'error': f'Admin {key} not found'}), 404
    
# @memberAPI.route('/member_validate', methods=['GET'])
# def validateMember():
#     key = request.args.get('username')
#     value = request.args.get('password')
#     if not key or not value:
#         return jsonify({'error': 'Missing username or password'}), 400
#     query = {'username': key,'password': value}
#     admin = test.find_one(query)
#     if not admin:
#         return jsonify({'error': 'Invalid username or password'}), 401
#     else:
#         admin["_id"] = str(admin["_id"])
#         return jsonify(admin), 200
    
@memberAPI.route("/member_add", methods=["POST"])
def addMember():
    key = request.args.get('username')
    data = request.args
    key = {'username': key}
    update = {'$set':{key:value} for key,value in data.items() if key != 'username'}
    member = test.find_one_and_update(key,update,
                                      upsert=True,return_document=ReturnDocument.AFTER)
    member_id = str(member['_id'])
    return jsonify({'_id': member_id, 'status_code': 0})

## add member info from a local file
@memberAPI.route("/member_add_file", methods=["POST"])
def addMember_file():
    filename = request.args.get('filename')
    with open(filename, 'r') as reader:
        # reader = csv.DictReader(f1)
        # for row in reader:
        #     # Create a dictionary with custom keys
        #     doc = {
        #         "fullname": row['fullname'],
        #         "department": row['department'],
        #         "pos": row['pos'],
        #         "project_group": row['project_group'],
        #         "pos_group": row['pos_group'],
        #         "grade": row['grade'],
        #         "email": row['email'],
        #         "wechat": row['wechat'],
        #         "enroll_time": row['enroll_time'],
        #         "linkedin": row['linkedin'],
        #         "github": row['github']
        #     }
        #     if (test.find_one(doc) == None):
        #         test.insert_one(doc)
        lines = reader.readlines()
        type = lines[0].split(",")
        lines = lines[1:]
        for l in lines:

            data = l.split(",")
            doc = dict(zip(type, data))
            if (test.find_one(doc) == None):
                test.insert_one(doc)


    return jsonify({'success': f'{filename} successfully loaded' })
    

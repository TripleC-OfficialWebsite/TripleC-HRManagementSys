from flask import Blueprint
from flask import Flask, request,jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import csv
# from app import collections

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
    for document in test.find({}, {"_id": 0}):
        data.append({
            "fullname": document["fullname"],
            "department": document["department"],
            "pos": document['pos'],
            "project_group": document['project_group'],
             "pos_group": document['pos_group'],
             "grade": document['grade'],
             "email": document['email'],
             "wechat": document['wechat'],
             "enroll_time": document['enroll_time'],
             "linkedin": document['linkedin'],
             "github": document['github']
        })
    return jsonify(data)
## use find_one to validate every document and delete the corresponding document
# @memberAPI.route('/member_delete', methods=['DELETE'])
# def removeMember():
#     key = request.args.get('username')
#     if not key:
#         return jsonify({'error': 'Missing username'}), 400
#     query = {'username': key}
#     result = test.delete_one(query)
#     if result.deleted_count == 1:
#         return jsonify({'success': f'Admin {key} deleted successfully'}), 200
#     else:
#         return jsonify({'error': f'Admin {key} not found'}), 404
    
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

## add one member info
@memberAPI.route("/member_add", methods=["POST"])
def addMember():
    a = request.args.get('fullname')
    b = request.args.get('department')
    c = request.args.get('pos')
    d = request.args.get('project_group')
    e = request.args.get('pos_group')
    f = request.args.get('grade')
    g = request.args.get('email')
    h = request.args.get('wechat')
    i = request.args.get('enroll_time')
    j = request.args.get('linkedin')
    k = request.args.get('github')
    data = {"fullname": a,
            "department": b,
            "pos": c,
            "project_group": d,
             "pos_group": e,
             "grade": f,
             "email": g,
             "wechat": h,
             "enroll_time": i,
             "linkedin": j,
             "github": k
        }
    if (test.find_one(data) != None):
        return jsonify({'error': 'Member is already in the member collection', 'status_code': 1})
    test.insert_one(data)
    member = test.find_one(data)
    member_id = str(member['_id'])
    return jsonify({'_id': member_id, 'status_code': 0})

## add member info from a local file
@memberAPI.route("/member_add_file", methods=["POST"])
def addMember_file():
    filename = request.args.get('filename')
    with open(filename, 'r') as f1:
        reader = csv.DictReader(f1)
        for row in reader:
            # Create a dictionary with custom keys
            doc = {
                "fullname": row['fullname'],
                "department": row['department'],
                "pos": row['pos'],
                "project_group": row['project_group'],
                "pos_group": row['pos_group'],
                "grade": row['grade'],
                "email": row['email'],
                "wechat": row['wechat'],
                "enroll_time": row['enroll_time'],
                "linkedin": row['linkedin'],
                "github": row['github']
            }
            if (test.find_one(doc) == None):
                test.insert_one(doc)

    return jsonify({'success': f'{filename} successfully loaded' })
    

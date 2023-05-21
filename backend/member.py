from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from pymongo import ReturnDocument
import xlsxwriter



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
    data = []
    input_data = request.get_json()
    if '_id' in input_data:
        member_id = input_data['_id']
        query = {"_id": ObjectId(member_id)}
    elif 'fullname' in input_data:
        name = input_data['fullname']
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

#     dept_pairs = departments.split(",")
#     proj_pairs = projects.split(",")

    departments_data = {p.split(":")[0]: p.split(":")[1] for p in dept_pairs}
    projects_data = {p.split(":")[0]: p.split(":")[1] for p in proj_pairs}

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

# Remove a member by fullname or id
@memberAPI.route('/member_delete', methods=['DELETE'])
def removeMember():
    input_data = request.get_json()
    assert {'fullname', '_id'}.intersection(input_data.keys()), "Bad request data"
    
    keys = input_data.get('fullname')
    if not keys:
        return jsonify({'error': f'no'}),200
    
    query = {'fullname': {'$in': keys}}

    result = test.delete_many(query)

    if result.deleted_count >= 1:
        return jsonify({'success': f'Member {query} deleted successfully'}), 200
    else:
        return jsonify({'error': f'Member {query} not found'}), 404
    
 # If the member is not found, insert a new document; otherwise, update the existing one
@memberAPI.route("/member_add", methods=["POST"])
def addMember():
    data = request.get_json()
    assert {'fullname', 'department', 'depart_role', 'project', 'project_role'}.issubset(data.keys()), "Bad request data"
    query = {"_id": ObjectId(data['_id'])} if '_id' in data else {'fullname': data['fullname']}
    
    
    update = {
        "$addToSet": {
            "Department": {'department': data['department'], 'depart_role': data['depart_role']},
            "Project": {'project': data['project'], 'project_role': data['project_role']}
        }
    }
    
    member = test.find_one_and_update(query,update,
                                        upsert=True,return_document=ReturnDocument.AFTER)
    member_id = str(member['_id'])
    
    return jsonify({'_id': member_id, 'status_code': 0})


# Add member info from a local file
@memberAPI.route("/member_add_file", methods=["POST"])
def addMember_file():
    filename = request.args.get('filename')

    with open(filename, 'r') as reader:
        lines = reader.readlines()
        header = [h.strip().title() for h in lines[0].split(",")]
        lines = lines[1:]  # Skip the header row

        member_docs = []

        for line in lines:
            data = [d.strip() if d.strip() else 'N/A' for d in line.split(",")]
            data = [d.title() if i == 2 or i == 4 or i == 8 else d for i, d in enumerate(data)]

            doc = dict(zip(header, data))
            member_docs.append(doc)

        # Insert all documents in bulk
        member_collection.insert_many(member_docs)

    return jsonify({'success': f'{filename} successfully imported'})



@memberAPI.route("/member_export", methods=["GET"])
def export_Member_file():
    filename = 'Members.xlsx'
    workbook = xlsxwriter.Workbook(filename)
    worksheet = workbook.add_worksheet()

    data = list(member_collection.find({}, {"_id": 0}))

    # Set headers
    header_format = workbook.add_format({'bold': True})
    for column, key in enumerate(data[0]):
        worksheet.write(0, column, key, header_format)

    # Write data
    for row, member in enumerate(data, start=1):
        for column, info in enumerate(member.values()):
                worksheet.write(row, column, info)

    # Set width to 15 characters
    for column in range(len(data[0])):
        worksheet.set_column(column, column, 15) 

    workbook.close()

            data = dict(zip(type, data))
            
            fullname = data.get('fullname')
            department = data.get('department')
            depart_role = data.get('pos')
            project = data.get('project_group')
            project_role = data.get('pos_group')

            doc = {
                "fullname": fullname,
                "Department": [{'department': department, 'depart_role': depart_role}],
                "Project": [{'project': project, 'project_role': project_role}]
            }
            
            existing_member = test.find_one({"fullname": fullname})
            if existing_member is None:
                test.insert_one(doc)
            

    return jsonify({'success': f'{filename} successfully loaded' })
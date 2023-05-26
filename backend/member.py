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

secret = db.get_collection('secret')

CORS(memberAPI)

# Check the MongoDB connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@memberAPI.route("/secret", methods=["GET"])
def get_secret():
    data = list(secret.find({}, {"_id": 0}))
    return jsonify(data)
@memberAPI.route("/secret_clear", methods=["DELETE"])
def clear_secret():
    secret.delete_many({})
    return jsonify({'success': 'Collection Secret deleted successfully'})
@memberAPI.route("/secret_fill", methods=["POST"])
def fill_secret():
    clear_secret()
    data = list(member_collection.find({}, {"_id": 0}))
    secret.insert_many(data)
    return jsonify({'success': 'Collection Secret filled successfully'})


@memberAPI.route("/member", defaults={'fullname': None}, methods=["GET"])
@memberAPI.route("/member/<string:fullname>", methods=["GET"])
def get(fullname):
    if fullname:
        query = {"fullname": fullname}
        member = member_collection.find_one(query, {"_id": 0})

        if member:
            return jsonify([member])
        
        return jsonify({'error': f'Member {fullname} not found'}), 404
    else:
        data = list(member_collection.find({}, {"_id": 0}))
        return jsonify(data)


# Retrieve documents within the specified range
@memberAPI.route("/member_range/<int:page_num>&<int:limit>", methods=["GET"])
def get_range(page_num, limit):
    if page_num < 0 or limit < 0:
        return jsonify({'error': f'Invalid input'}), 400
    data = list(member_collection.find({}, {"_id": 0}).skip(page_num * limit).limit(limit))
    ret = jsonify(data)
    clear_secret()
    secret.insert_many(data)
    return ret

@memberAPI.route("/member_list", methods=["GET"])
def get_department():
    query = request.args.get('type').lower()
    if query not in ['department','project']:
        return jsonify({'error': 'Invalid type (please enter \'department\' or \'project\')'}), 400
    items = set()
    data = list(member_collection.find({}, {"_id": 0}))

    for d in data:
        key = d[query] if query == 'department' else d[query].values()
        key = [k for k in key if k != 'None']
        items.update(key)

    sorted_items = sorted(items)
    return jsonify(list(sorted_items))

# Retrieve documents matching the department/Project and role
# @memberAPI.route("/member_search", methods=["GET"])
# def search():
#     departments = request.args.get('department')
#     projects = request.args.get('project')

#     data = []
#     dept_pairs = departments.split(",")
#     proj_pairs = projects.split(",")

#     departments_data = {p.split(":")[0]: p.split(":")[1] for p in dept_pairs}
#     projects_data = {p.split(":")[0]: p.split(":")[1] for p in proj_pairs}

#     for dept,role in departments_data.items():
#         document = member_collection.find({"department": dept.upper(),"pos": role.title()}, {"_id": 0})
#         for d in document:
#             if d not in data:
#                 data.append(d)
    
#     for proj,role in projects_data.items():
#         document = member_collection.find({"project_group": proj,"pos_group": role.title()}, {"_id": 0})
#         for d in document:
#             if d not in data:
#                 data.append(d)
    
#     return jsonify(data)

# Remove a member by fullname or id

@memberAPI.route('/member_delete/<string:fullname>', methods=['DELETE'])
def remove_member(fullname):
    if fullname is None:
        return jsonify({'error': 'Missing input fullname'}), 400
    
    query = {'fullname': fullname}
    result = member_collection.delete_one(query)
    delete_secret = secret.delete_one(query)
    assert delete_secret == 1
    if result.deleted_count == 1:
        return jsonify({'success': f'Member {fullname} deleted successfully'}), 200

    return jsonify({'error': f'Member {fullname} not found'}), 404
    
 # If the member is not found, insert a new document; otherwise, update the existing one
@memberAPI.route("/member_add", methods=["POST"])
def add_member():
    data = request.get_json()
    fullname = data['fullname']
    if fullname is None:
        return jsonify({'error': 'Missing member fullname'}), 400
    query = {'fullname': fullname}
    update = {'$set': {key: value for key, value in data.items() if key != 'fullname'}}

    member = member_collection.find_one_and_update(query, update, upsert=True, \
                                                   return_document=ReturnDocument.AFTER)
    secret.find_one_and_update(query, update, upsert=True, \
                                                   return_document=ReturnDocument.AFTER)
    member_id = str(member['_id'])

    return jsonify({'_id': member_id, 'status_code': 0})

@memberAPI.route("/member_sort/<string:type>&<string:order>", methods=["GET"])
def sort_alphabetically(type,order):
    ascending = True
    if order not in ['ascending','descending']:
        ascending = True
    else:
        ascending = order == 'ascending'
    sortBy = request.args.get('by').lower()

    if sortBy not in ['department','project']:
        return jsonify({'error': 'Missing input type'}), 400
    
    data = list(secret.find({}, {"_id": 0}))

    sorted_data = sorted(data, key=lambda doc: list(doc[sortBy].values())[0])
    if not ascending:
        sorted_data.reverse()
    ret = jsonify(sorted_data)
    clear_secret()
    secret.insert_many(sorted_data)
    return ret

@memberAPI.route("/member_search_name", methods=["GET"])
def search_name():
    name = request.args.get('name')
    if name is None:
        return jsonify({'error': 'Missing input name'}), 400
    
    data = member_collection.find({},{'_id':0})
    data = list(filter(lambda member:member['fullname'][0] == name,data))
    return jsonify(data)


@memberAPI.route("/member_add_file", methods=["POST"])
def addMember_file():
    filename = request.args.get('filename')

    if filename is None:
        return jsonify({'error': 'Missing input filename'}), 400
    with open(filename, 'r') as reader:
        lines = reader.readlines()
        header = lines[0].strip().split(',')
        lines = lines[1:] 

        member_docs = []

        for line in lines:
            data = [d.strip() if d.strip() else 'None' for d in line.split(",")]
            data = [d.title() if i == 2 or i == 4 else d for i, d in enumerate(data)]
            data = [d.split('/') if idx in [1,2,3,4] else d for idx, d in enumerate(data)]
            
            fullname, department, depart_role, project, project_role = data[:5]
            department_roles = dict(zip(department, depart_role))
            project_roles = dict(zip(project, project_role))
            
            doc = {
                "fullname": fullname,
                "department": department_roles,
                "project": project_roles
            }
            doc.update(dict(zip(header[5:], data[5:])))
            member_docs.append(doc)

        member_collection.insert_many(member_docs)
        clear_secret()
        secret.insert_many(member_docs)
    return jsonify({'success': f'{filename} successfully imported'})



@memberAPI.route("/member_export", methods=["GET"])
def export_Member_file():
    filename = 'Members.xlsx'
    workbook = xlsxwriter.Workbook(filename)
    worksheet = workbook.add_worksheet()

    data = list(secret.find({}, {"_id": 0}))

    # Set headers
    header_format = workbook.add_format({'bold': True})
    headers = ['fullname', 'department', 'pos', 'project_group', 'pos_group']
    for column, header in enumerate(headers):
        worksheet.write(0, column, header, header_format)

    for row, member in enumerate(data, start=1):
        worksheet.write(row, 0, member.get('fullname'))
        worksheet.write(row, 1, '/'.join([k for k in member.get('department').keys()]))
        worksheet.write(row, 2, '/'.join([k for k in member.get('department').values()]))
        worksheet.write(row, 3, '/'.join([k for k in member.get('project').keys()]))
        worksheet.write(row, 4, '/'.join([k for k in member.get('project').values()]))

    for column in range(len(headers)):
        worksheet.set_column(column, column, 20)
    for row in range(len(data) + 1):
        worksheet.set_row(row, 20)
    
    workbook.close()

    return jsonify({'success': f'{filename} successfully exported'})

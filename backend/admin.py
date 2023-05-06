from flask import Blueprint
from flask import Flask, request,jsonify
# from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

adminAPI = Blueprint('admin_api', __name__)

uri = "mongodb+srv://root:28GJiZtTYasykeil@cluster0.4lirrab.mongodb.net/?retryWrites=true&w=majority"

# app = Flask(__name__)
# CORS(app)

# # Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tls=True,
                             tlsAllowInvalidCertificates=True)

# Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

db = client.manageSys
test = db.test
@adminAPI.route("/add", methods=["POST"])
def addAdmin():
    key = request.args.get('username')
    value = request.args.get('password')
    data = {'username': key,'password': value}
    test.insert_one(data)
    return "0"
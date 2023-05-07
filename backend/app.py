from flask import Flask, request,jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
# from admin import adminAPI
# from member import memberAPI
import admin
import member



app = Flask(__name__)

app.register_blueprint(admin.adminAPI)
app.register_blueprint(member.memberAPI)


uri = "mongodb+srv://root:28GJiZtTYasykeil@cluster0.4lirrab.mongodb.net/?retryWrites=true&w=majority"

# app = Flask(__name__)
CORS(app)

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tls=True,
                             tlsAllowInvalidCertificates=True)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.manageSys
test = db.test

# member_collection = db['member']
collections = {'admin':admin.admin_collection,'member':member.member_collection}
@app.route("/", methods=["GET"])
def get():
    data = []
    collection = request.args.get('collection')
    if (collection == None):
        for c in collections.values():
            for document in c.find({}, {"_id": 0}):
                data.append(document)
        return jsonify(data)
        
    for document in collections[collection].find({}, {"_id": 0}):
        data.append(document)
    return jsonify(data)



if __name__ == "__main__":
    app.run(debug=True)
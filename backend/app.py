from flask import Flask, request,jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from admin import adminAPI



app = Flask(__name__)

app.register_blueprint(adminAPI)


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

@app.route("/", methods=["GET"])
def get():
    data = []
    for document in test.find({}, {"_id": 0}):
        data.append({
            "collection": document["collection"],
            "username": document["username"],
            "password": document["password"]
        })
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
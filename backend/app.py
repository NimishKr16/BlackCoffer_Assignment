# app.py

from flask import Flask, jsonify, request  # Import request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

# Create Flask App
app = Flask(__name__)

# Enable CORS for API and resource sharing to frontend
CORS(app, origins=["http://localhost:3000"]) 

# Load environment variables
load_dotenv()

# Connect to MongoDB
uri = os.getenv("MONGODB_URI")
client = MongoClient(uri, server_api=ServerApi('1'), tlsAllowInvalidCertificates=True)

# Select Database and Collection
db = client["BlackCoffer"]
collection = db["energy_insights"]

print("CONNECTED TO ALL THE DB AND COLLECTION")
# app.py

from flask import Flask, jsonify, request  # Import request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from collections import defaultdict, Counter
import calendar
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


@app.route('/api/insights', methods=['GET'])
def get_insights():
    insights = list(collection.find({}, {'_id': 0}))
    # print(insights)
    return jsonify(insights)

@app.route('/api/insights/monthly-averages', methods=['GET'])
def get_monthly_averages():
    # Convert `added` to a date and use `$year` and `$month`
    pipeline = [
        {
            "$addFields": {
                "added_date": {
                    "$dateFromString": {
                        "dateString": "$added",
                        "format": "%B, %d %Y %H:%M:%S"
                    }
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "month": {"$month": "$added_date"},
                    "year": {"$year": "$added_date"}
                },
                "average_relevance": {"$avg": "$relevance"},
                "average_likelihood": {"$avg": "$likelihood"}
            }
        }
    ]

    result = list(collection.aggregate(pipeline))

    # Prepare data for frontend
    month_data = defaultdict(lambda: {"relevance": 0, "likelihood": 0, "count": 0})
    for item in result:
        month_num = item["_id"]["month"]
        year = item["_id"]["year"]
        
        # Store relevance and likelihood averages
        month_data[month_num] = {
            "relevance": item["average_relevance"],
            "likelihood": item["average_likelihood"]
        }
    
    # Sort the dictionary by month
    sorted_month_data = {calendar.month_abbr[m]: values for m, values in sorted(month_data.items())}
    
    return jsonify(sorted_month_data)

@app.route('/api/insights/sector-shares', methods=['GET'])
def get_sector_shares():
    pipeline = [
        {
            "$group": {
                "_id": "$sector",
                "count": {"$sum": 1}
            }
        }
    ]
    result = list(collection.aggregate(pipeline))
    
    # Prepare data for frontend, filtering out empty sectors
    sector_shares = [{"sector": item["_id"], "count": item["count"]} for item in result if item["_id"]]

    return jsonify(sector_shares)


@app.route('/api/insights/metrics_by_year', methods=['GET'])
def get_metrics_by_year():
    pipeline = [
        {
            "$group": {
                "_id": "$year",
                "intensity": {"$avg": "$intensity"},
                "likelihood": {"$avg": "$likelihood"},
                "relevance": {"$avg": "$relevance"}
            }
        },
        {"$sort": {"_id": 1}}  # Sort by year
    ]
    results = list(collection.aggregate(pipeline))
    # Format the response to have year labels and data for each metric
    data = {
        "years": [result["_id"] for result in results],
        "intensity": [result["intensity"] for result in results],
        "likelihood": [result["likelihood"] for result in results],
        "relevance": [result["relevance"] for result in results]
    }
    return jsonify(data)

@app.route('/api/insights/country-region-distribution', methods=['GET'])
def get_country_region_distribution():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "country": "$country",
                    "region": "$region"
                },
                "count": {"$sum": 1}
            }
        }
    ]
    result = list(collection.aggregate(pipeline))

    # Format data for frontend
    country_region_data = [
        {
            "country": item["_id"]["country"],
            "region": item["_id"]["region"],
            "count": item["count"]
        } for item in result if item["_id"]["country"]  # Filter out empty countries
    ]

    return jsonify(country_region_data)

# Endpoint for Word Cloud Data
@app.route('/api/topics/frequencies', methods=['GET'])
def get_topic_frequencies():
    topics = collection.find({}, {"topic": 1, "_id": 0})
    
    # Calculate frequency of each topic
    topic_list = [doc["topic"] for doc in topics if "topic" in doc and doc["topic"]]
    topic_counts = Counter(topic_list)
    
    # Convert to JSON format for frontend
    word_cloud_data = [{"text": topic, "value": count} for topic, count in topic_counts.items()]
    print(word_cloud_data)
    return jsonify(word_cloud_data)

@app.route('/api/insights/intensity', methods=['GET'])
def get_intensity_insights():
    insights = list(collection.find({}, {'_id': 0, 'year': 1, 'intensity': 1}))  # Adjust fields as needed
    return jsonify(insights)

if __name__ == "__main__":
    app.run(debug=True,port=5500)
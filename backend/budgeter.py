
import os
import sys
import csv
import json

from datetime import datetime
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

with open("pin.txt", "r") as f:
    pin = f.readline().strip()


@app.route("/api/ping", methods=["GET"])
def ping():
    return "pong", 200


@app.route("/api/lookup", methods=["GET"])
def lookup():
    year, month = get_formatted_year_and_month_from_GET()

    if not os.path.isdir("budgets"):
        return {"error": "budgets directory not found"}, 201

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"error": f"budget file not found for {year}-{month}"}, 200
    
    return {}
    

@app.route("/api/income", methods=["POST"])
@cross_origin()
def get_income():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")
    
    if not os.path.isfile(budget_file):
        return {"incomes": []}, 201

    with open(budget_file, "r") as f:
        data = json.load(f)

    return {"incomes": data.get("income", [])}, 200

@app.route("/api/income/add", methods=["POST"])
@cross_origin()
def add_income():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"incomes": []}, 201

    with open(budget_file, "r") as f:
        data = json.load(f)
    
    data["income"].append(body)

    print(f"Adding income {body}")

    with open(budget_file, "w") as f:
        json.dump(data, f)
    
    return {"incomes": data.get("income", [])}, 200


@app.route("/api/totalIncome", methods=["POST"])
@cross_origin()
def get_total_income():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"total": 0}
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for i in data.get("income", []):
        total += i.get("amount", 0)

    return {"total": total}


@app.route("/api/expenses", methods=["POST"])
@cross_origin()
def get_expenses():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"expenses": []}

    with open(budget_file, "r") as f:
        data = json.load(f)
    
    return {"expenses": data.get("expenses", [])}


@app.route("/api/expenses/add", methods=["POST"])
@cross_origin()
def add_expense():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"expenses": []}, 201

    with open(budget_file, "r") as f:
        data = json.load(f)
    
    data["expenses"].append(body)

    print(f"Adding expense {body}")

    with open(budget_file, "w") as f:
        json.dump(data, f)
    
    return {"expenses": data.get("expenses", [])}, 200


@app.route("/api/totalExpenses", methods=["POST"])
@cross_origin()
def get_total_expenses():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"total": 0}, 201
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for e in data.get("expenses", []):
        total += e.get("amount", 0)

    return {"total": total}, 200


@app.route("/api/netIncome", methods=["POST"])
def get_net_income():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"total": 0}, 201
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for i in data.get("income", []):
        total += i.get("amount", 0)
    for e in data.get("expenses", []):
        total -= e.get("amount", 0)

    return {"total": total}, 200


@app.route("/api/income/delete", methods=["POST"])
def delete_income():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]
    index = body.get("index", 0)

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"error": f"budget file not found for {year}-{month}"}, 201

    with open(budget_file, "r") as f:
        data = json.load(f)

    del data["income"][index]

    with open(budget_file, "w") as f:
        json.dump(data, f)

    return data["income"], 200


@app.route("/api/expenses/delete", methods=["POST"])
def delete_expense():
    body = request.get_json()
    date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    year = date.split("-")[0]
    month = date.split("-")[1]
    index = body.get("index", 0)

    if request.headers.get("Authorization", "") != pin:
        return {"error": "invalid pin"}, 401

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"error": f"budget file not found for {year}-{month}"}, 201

    with open(budget_file, "r") as f:
        data = json.load(f)

    del data["expenses"][index]

    with open(budget_file, "w") as f:
        json.dump(data, f)

    return data["expenses"], 200


def get_formatted_year_and_month_from_GET():
    year = request.args.get("year", None)
    month = request.args.get("month", None)

    if not year:
        year = str(datetime.now().year)
    if len(year) == 2:
        year = f"20{year}"
    
    if not month:
        month = str(datetime.now().month)
    if len(month) == 1:
        month = f"0{month}"
    
    return year, month


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
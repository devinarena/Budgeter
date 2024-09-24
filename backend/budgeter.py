
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
    

@app.route("/api/income", methods=["GET", "POST"])
@cross_origin()
def get_income():
    if request.method == "GET":
        year, month = get_formatted_year_and_month_from_GET()

        budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")
        print(f"budget-{year}-{month}.json")
        if not os.path.isfile(budget_file):
            return {"incomes": []}, 201

        with open(budget_file, "r") as f:
            data = json.load(f)

        return {"incomes": data.get("income", [])}, 200
    elif request.method == "POST":
        body = request.get_json()
        date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
        year = date.split("-")[0]
        month = date.split("-")[1]

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


@app.route("/api/totalIncome", methods=["GET"])
def get_total_income():
    year, month = get_formatted_year_and_month_from_GET()

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"total": 0}
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for i in data.get("income", []):
        total += i.get("amount", 0)

    return {"total": total}


@app.route("/api/expenses", methods=["GET", "POST"])
@cross_origin()
def get_expenses():
    if request.method == "GET":
        year, month = get_formatted_year_and_month_from_GET()

        budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

        if not os.path.isfile(budget_file):
            return {"expenses": []}

        with open(budget_file, "r") as f:
            data = json.load(f)
        
        return {"expenses": data.get("expenses", [])}
    elif request.method == "POST":
        body = request.get_json()
        date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
        year = date.split("-")[0]
        month = date.split("-")[1]

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


@app.route("/api/totalExpenses", methods=["GET"])
def get_total_expenses():
    year, month = get_formatted_year_and_month_from_GET()

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"total": 0}, 201
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for e in data.get("expenses", []):
        total += e.get("amount", 0)

    return {"total": total}, 200


@app.route("/api/netIncome", methods=["GET"])
def get_net_income():
    year, month = get_formatted_year_and_month_from_GET()

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


@app.route("/api/income/<string:year>/<string:month>/<int:index>", methods=["DELETE"])
def delete_income(year, month, index):
    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"error": f"budget file not found for {year}-{month}"}, 201

    with open(budget_file, "r") as f:
        data = json.load(f)

    del data["income"][index]
    print(data)

    with open(budget_file, "w") as f:
        json.dump(data, f)

    return data, 200


@app.route("/api/expenses/<string:year>/<string:month>/<int:index>", methods=["DELETE"])
def delete_expense(year, month, index):
    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"error": f"budget file not found for {year}-{month}"}, 201

    with open(budget_file, "r") as f:
        data = json.load(f)

    del data["expenses"][index]
    print(data)

    with open(budget_file, "w") as f:
        json.dump(data, f)

    return data, 200


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
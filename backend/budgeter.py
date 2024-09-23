
import os
import sys
import csv
import json

from datetime import datetime
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/ping", methods=["GET"])
def ping():
    return "pong"


@app.route("/lookup", methods=["GET"])
def lookup():
    year, month = get_formatted_year_and_month_from_GET()

    if not os.path.isdir("budgets"):
        return {"error": "budgets directory not found"}

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return {"error": f"budget file not found for {year}-{month}"}
    
    return {}
    

@app.route("/income", methods=["GET", "POST"])
def get_income():
    if request.method == "GET":
        year, month = get_formatted_year_and_month_from_GET()

        budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")
        print(f"budget-{year}-{month}.json")
        if not os.path.isfile(budget_file):
            return []

        with open(budget_file, "r") as f:
            data = json.load(f)

        return data.get("income", [])
    elif request.method == "POST":
        body = request.get_json()
        date = body.get("date", datetime.now().strftime("%Y-%m-%d"))
        year = date.split("-")[0]
        month = date.split("-")[1]

        budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

        if not os.path.isfile(budget_file):
            return []

        with open(budget_file, "r") as f:
            data = json.load(f)
        
        data["income"].append(body)

        with open(budget_file, "w") as f:
            json.dump(data, f)
        
        return data.get("income", [])

@app.route("/totalIncome", methods=["GET"])
def get_total_income():
    year, month = get_formatted_year_and_month_from_GET()

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return "0"
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for i in data.get("income", []):
        total += i.get("amount", 0)

    return {"total": total}


@app.route("/expenses", methods=["GET"])
def get_expenses():
    year, month = get_formatted_year_and_month_from_GET()

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return []

    with open(budget_file, "r") as f:
        data = json.load(f)
    
    return data.get("expenses", [])


@app.route("/totalExpenses", methods=["GET"])
def get_total_expenses():
    year, month = get_formatted_year_and_month_from_GET()

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return "0"
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for e in data.get("expenses", []):
        total += e.get("amount", 0)

    return {"total": total}


@app.route("/netIncome", methods=["GET"])
def get_net_income():
    year, month = get_formatted_year_and_month_from_GET()

    budget_file = os.path.join("budgets", f"budget-{year}-{month}.json")

    if not os.path.isfile(budget_file):
        return "0"
    
    with open(budget_file, "r") as f:
        data = json.load(f)

    total = 0
    for i in data.get("income", []):
        total += i.get("amount", 0)
    for e in data.get("expenses", []):
        total -= e.get("amount", 0)

    return {"total": total}


def get_formatted_year_and_month_from_GET():
    year = request.args.get("year")
    month = request.args.get("month")

    if not year:
        year = str(datetime.now().year)
    if len(year) == 2:
        year = f"20{year}"
    
    if not month:
        month = str(datetime.now().month)
    if len(month) == 1:
        month = f"0{month}"
    
    return year, month
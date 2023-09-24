from logging import getLogger, _nameToLevel

from flask import Flask, jsonify, request
from modules import Database, fread

getLogger("werkzeug").setLevel(_nameToLevel["ERROR"])

app = Flask(
    "WashNext",
    static_folder="res",
    static_url_path="/res"
)

db = Database()

db.new_base("User")
db.new_base("Wash")

@app.route("/")
def home():
    return fread("index.html")

@app.route("/api/machines/<category>")
def machines_list(category: str):
    machines = db.get_all(category.title())
    return jsonify(machines)

@app.route("/api/machine/<category>/<mid>")
@app.route("/api/machines/<category>/<mid>")
def machine_details(category: str, mid: str):
    machine_data = db.get(category.title(), mid.upper())
    if not machine_data: return jsonify({})

    return jsonify(machine_data)

@app.route("/api/machine/<category>/<mid>/book", methods=["POST"])
@app.route("/api/machines/<category>/<mid>/book", methods=["POST"])
def book_machine(category: str, mid: str):
    machine_data = db.get(category.title(), mid.upper())
    if not machine_data: return jsonify({
        "OK": False,
        "msg": "Machine not found"
    })

    schedule_request = request.get_json()
    schedule = machine_data["schedule"]

    slot_available = True

    for slot in schedule:
        if all([
            slot["date"] == schedule_request["date"],
            slot["time"] == schedule_request["time"]
        ]):
            slot_available = False
            break
    
    if not slot_available:
        return jsonify({
            "OK": True,
            "booked": False,
            "msg": "Slot is already busy"
        })
    
    machine_data["schedule"].append(schedule_request)
    db.put(category, mid, machine_data)

    return jsonify({
        "OK": True,
        "booked": True,
        "msg": "Slot booked successfully"
    })

@app.route("/machines/<category>")
def machines_list_page(category: str):
    return fread("category/index.html", category=category.title())

@app.route("/machine/<category>/<mid>")
@app.route("/machines/<category>/<mid>")
def machines_details_page(category: str, mid: str):
    return fread("category/machine.html", category=category.title(), id=mid.upper())

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8000

    app.run(host=host, port=port)


from flask import Flask, render_template, request, jsonify
import webview
import threading
import sys
import os
import json

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.abspath("."))
    return os.path.join(base_path, relative_path)


app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/save-session", methods=["POST"])
def save_session():
    data = request.get_json()
    session_file = "session_data.json"

    if os.path.exists(session_file):
        with open(session_file, "r") as f:
            session_data = json.load(f)
    else:
        session_data = {"sessions": [], "total_pomodoros": 0}

    session_data["sessions"].append(data)

    if data.get("mode") == "work":
        session_data["total_pomodoros"] += 1

    with open(session_file, "w") as f:
        json.dump(session_data, f, indent=4)

    return jsonify({"status": "saved"}), 200

def run_flask():
    app.run(debug=False, port=5000) 
    
if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.daemon = True
    flask_thread.start()
    
    webview.create_window("Tomato Clock 🍅", "http://127.0.0.1:5000")
    webview.start()





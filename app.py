from flask import Flask, render_template, request
import webview
import threading
import sys
import os

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.abspath("."))
    return os.path.join(base_path, relative_path)


app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

def run_flask():
    app.run(debug=False, port=5000) 
    
if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.daemon = True
    flask_thread.start()
    
    webview.create_window("Tomato Clock 🍅", "http://127.0.0.1:5000")
    webview.start()





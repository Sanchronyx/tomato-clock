from flask import Flask, render_template, request
import webview
import threading

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
    
    webview.create_window("Tomato Clock Brothers In Christ!", "http://127.0.0.1:5000")
    webview.start()





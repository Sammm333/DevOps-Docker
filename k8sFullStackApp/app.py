from flask import Flask
import psycopg2
import os

app = Flask(__name__)

@app.route('/')
def check_db():
    try:
        conn = psycopg2.connect(
            dbname=os.environ.get("POSTGRES_DB", "postgres"),
            user=os.environ.get("POSTGRES_USER"),
            password=os.environ.get("POSTGRES_PASSWORD"),
            host=os.environ.get("DB_HOST", "postgres"),
            port="5432"
        )
        conn.close()
        return "<h1>Connected to the database successfully!</h1>"
    except Exception as e:
        return f"<h1>Database connection failed:</h1><p>{e}</p>"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)

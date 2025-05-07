from flask import Flask
import psycopg2
import os

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST", "postgres"),
        port="5432"
    )
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS visits (id SERIAL PRIMARY KEY, time TIMESTAMP DEFAULT now());")
    cur.execute("INSERT INTO visits DEFAULT VALUES;")
    cur.execute("SELECT COUNT(*) FROM visits;")
    count = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return f'Hello! This page has been visited {count} times.'

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

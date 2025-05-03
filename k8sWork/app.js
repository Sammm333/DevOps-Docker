const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();

const DB_USER = process.env.MONGO_DB_USERNAME;
const DB_PASS = process.env.MONGO_DB_PWD;

if (!DB_USER || !DB_PASS) {
  console.error("❌ MONGO_DB_USERNAME or MONGO_DB_PWD is not set in environment variables.");
  process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// For local development: "mongodb://admin:password@localhost:27017"
const mongoUrl = `mongodb://${DB_USER}:${DB_PASS}@mongodb`;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const databaseName = "my-db";
const collectionName = "my-collection";

app.get('/fetch-data', (req, res) => {
  MongoClient.connect(mongoUrl, mongoOptions, (err, client) => {
    if (err) {
      console.error("❌ Failed to connect to MongoDB:", err);
      return res.status(500).send({ error: "Database connection error" });
    }

    const db = client.db(databaseName);
    const query = { myid: 1 };

    db.collection(collectionName).findOne(query, (err, result) => {
      client.close(); // Always close connection

      if (err) {
        console.error("❌ Error fetching data:", err);
        return res.status(500).send({ error: "Failed to fetch data" });
      }

      res.send(result || {});
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ App listening on port ${PORT}`);
});


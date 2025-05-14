const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
const upload = multer();

const CONNECTION_STRING = "mongodb+srv://akshayaborugadda2524:Reena2594@cluster0.vo79hkg.mongodb.net/todoappdb?retryWrites=true&w=majority&appName=Cluster0";
const DATABASENAME = "todoappdb";

let database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true })
    .then(client => {
      database = client.db(DATABASENAME);
      console.log("MongoDB connection successful.");
    })
    .catch(error => {
      console.error("MongoDB connection failed:", error);
    });
});

app.get('/api/todoapp/GetNotes', (req, res) => {
  database.collection("todoappcollection").find({}).toArray((err, result) => {
    res.send(result);
  });
});

app.post('/api/todoapp/AddNotes', upload.none(), (req, res) => {
  database.collection("todoappcollection").countDocuments({}, (err, count) => {
    database.collection("todoappcollection").insertOne({
      id: (count + 1).toString(),
      description: req.body.newNotes
    });
    res.json("Added successfully");
  });
});

app.delete('/api/todoapp/DeleteNotes', (req, res) => {
  database.collection("todoappcollection").deleteOne({
    id: req.query.id
  });
  res.json("Deleted successfully");
});

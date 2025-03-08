import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

console.log(process.env.HOST);
console.log(process.env.USER);
console.log(process.env.PASSWORD);
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: `#$${process.env.PASSWORD}`,
  database: "maptyDBMS",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

app.get("/user/all", (req, res) => {
  db.query("SELECT * FROM login", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/user/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "INSERT INTO login (username, password) values (?,?)",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

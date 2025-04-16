import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
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

app.post("/user/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Username: ", username);
  console.log("Password: ", password);
  console.log(
    `SELECT * FROM login WHERE username = '${username}' AND password = '${password}' `
  );
  db.query(
    `SELECT * FROM login WHERE username = ? AND password = ? `,
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length === 0) {
        console.log("No user found in the database");
        res.send("UserNotFound");
      } else {
        console.log("User found in the database", result);
        res.send("UserFound");
      }
    }
  );
});

app.post("/user/register", (req, res) => {
  const { height, weight, age, gender, bmi, username, password } = req.body;
  db.query(
    "INSERT INTO login (username, password) values (?,?)",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values inserted into login table");
      }
    }
  );
  console.log(
    `INSERT INTO profile (height , weight , age , gender , bmi , username) values (${height},${weight},${age},${gender},${bmi},${username})`
  );
  db.query(
    "INSERT INTO profile (height , weight , age , gender , bmi , username) values (?,?,?,?,?,?) ",
    [height, weight, age, gender, bmi, username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values inserted into profile table");
        res.send("Values Inserted into Login & Profile Table");
      }
    }
  );
});

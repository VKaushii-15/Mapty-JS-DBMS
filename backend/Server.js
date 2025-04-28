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
  host: "localhost",
  user: "root",
  password: "root15",
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
  let { username, password } = req.body;
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

app.post("/user/run", (req, res) => {
  const rec = req.body.workout;
  const id = rec.id;
  const calories = rec.calories;
  const username = rec.username;
  const completed = rec.completed;
  const distance = rec.distance;
  const duration = rec.duration;
  console.log(
    `INSERT INTO running (id , distance , calories , duration , completed , username) VALUES (${id} , ${distance},${calories},${duration} , ${completed} , ${username})`
  );
  db.query(
    "INSERT INTO running (id,distance , calories , duration , completed , username) VALUES (?,?,?,?,?,?)",
    [id,distance, calories, duration, completed, username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values inserted into running table");
        res.send("Values Inserted into Required Table");
      }
    }
  );
});

app.post("/user/cycling", (req, res) => {
  const rec = req.body.workout;
  const id = rec.id;
  const calories = rec.calories;
  const username = rec.username;
  const completed = rec.completed;
  const distance = rec.distance;
  const duration = rec.duration;
  console.log(
    `INSERT INTO cycling (id , distance , calories , duration , completed , username) VALUES (${id},${distance},${calories},${duration} , ${completed} , ${username})`
  );
  db.query(
    "INSERT INTO cycling (id , distance , calories , duration , completed , username) VALUES (?,?,?,?,?,?)",
    [id , distance, calories, duration, completed, username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values inserted into cycling table");
        res.send("Values Inserted into Required Table");
      }
    }
  );
});

app.post("/user/swim", (req, res) => {
  const rec = req.body.workout;
  const id = rec.id;
  const laps = rec.laps;
  const calories = rec.calories;
  const username = rec.username;
  const completed = rec.completed;
  const distance = rec.distance;
  const duration = rec.duration;
  console.log(
    `INSERT INTO swimming(id , distance , calories , laps ,duration , completed , username) VALUES (${id},${distance},${calories},${laps},${duration} , ${completed} , ${username})`
  );
  db.query(
    "INSERT INTO swimming (id , distance , calories , laps ,duration , completed , username) VALUES (?,?,?,?,?,?,?)",
    [id , distance, calories, laps, duration, completed, username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values inserted into swimming table");
        res.send("Values Inserted into Required Table");
      }
    }
  );
});

app.post("/user/home", (req, res) => {
  console.log("Inside home workout post request");
  console.log(req.body.workout);
  const rec = req.body.workout;
  const id = rec.id;
  const calories = rec.calories;
  const types = rec.types;
  const sets = rec.sets;
  const duration = rec.duration;
  const completed = rec.completed;
  const username = rec.username;
  console.log(
    `INSERT INTO homeworkout(id , types , sets , calories , duration , completed , username) VALUES (${id},${types},${sets},${duration} , ${completed} , ${username})`
  );
  db.query(
    "INSERT INTO homeworkout (id ,types , sets , calories , duration , completed , username) VALUES (?,?,?,?,?,?,?)",
    [id , types, sets, calories, duration, completed, username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values inserted into homeworkout table");
        res.send("Values Inserted into Required Table");
      }
    }
  );
});

app.get("/user/getrun", (req, res) => {
  const { username } = req.query;
  console.log("Username recieved from getstorage: ", username);
  const query = `SELECT id , distance, calories, duration, completed FROM running WHERE username = "${username}";`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Values fetched from Running table");
      const output = JSON.stringify(result);
      res.send(output);
    }
  });
});

app.get("/user/getcycling", (req, res) => {
  const { username } = req.query;
  console.log("Username recieved from getstorage: ", username);
  const query = `SELECT id , distance, calories, duration, completed FROM cycling WHERE username = "${username}";`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Values fetched from Cycling table");
      const output = JSON.stringify(result);
      res.send(output);
    }
  });
});

app.get("/user/getswim", (req, res) => {
  const { username } = req.query;
  const query = `SELECT id , distance, calories, laps, duration, completed FROM swimming WHERE username = "${username}";`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Values fetched from swimming table");
      const output = JSON.stringify(result);
      res.send(output);
    }
  });
});

app.get("/user/gethome", (req, res) => {
  const { username } = req.query;
  const query = `SELECT id , types , sets ,calories , duration , completed FROM homeworkout WHERE username = "${username}";`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Values fetched from HomeWorkout table");
      const output = JSON.stringify(result);
      res.send(output);
    }
  });
});

app.post("/user/update", (req, res) => {
  const rec = req.body.workout;
  const id = rec.id;
  const type = rec.type;
  const completed = rec.completed;
  const query = `UPDATE ${type} SET completed = "${completed}" WHERE id = ${id};`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Values updated in required table");
      res.send("Values updated in required table");
    }
  });
});
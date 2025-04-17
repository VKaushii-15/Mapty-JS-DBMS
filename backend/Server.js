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

app.post("/user/cardio" , (req , res) => {
  const table = req.body.type;
  const calories = req.body.calories;
  const username = req.body.username;
  const completed = req.body.completed;
  const distance = req.body.distance;
  const duration = req.body.duration;
  console.log(`INSERT INTO ${table} (distance , calories , time , completed , username) VALUES (${distance},${calories},${duration} , ${completed} , ${username})`)
  db.query(`INSERT INTO ${table} (distance , calories , time , completed , username) VALUES (?,?,?,?,?)`,[distance , calories , duration , completed , username],(err,result) =>{
    if(err){
      console.log(err);
    }else{
      console.log("Values inserted into",table);
      res.send("Values Inserted into Cardio Table");
    }
  }
  )
  });

app.post("/user/swim", (req, res) => {
  const laps  = req.body.laps;
  const calories = req.body.calories;
  const username = req.body.username;
  const completed = req.body.completed;
  const distance = req.body.distance;
  const duration = req.body.time;
  console.log(`INSERT INTO swimming(distance , calories , laps ,time , completed , username) VALUES (${distance},${calories},${laps},${duration} , ${completed} , ${username})`)
  db.query(`INSERT INTO swimming (distance , calories , laps ,time , completed , username) VALUES (?,?,?,?,?)`,[distance , calories ,laps, duration , completed , username],(err,result) =>{
    if(err){
      console.log(err);
    }else{
      console.log("Values inserted into",table);
      res.send("Values Inserted into Cardio Table");
    }
  }
  )
  });

  app.post("/user/home", (req, res) => {
    const types = req.body.type;
    const sets = req.body.sets;
    const duration = req.body.duration;
    const completed = req.body.completed;
    const username = req.body.username;
    console.log(`INSERT INTO homeworkout(types , sets , time , completed , username) VALUES (${types},${sets},${duration} , ${completed} , ${username})`)
  db.query(`INSERT INTO homeworkout (types , sets , time , completed , username) VALUES (?,?,?,?,?)`,[types , sets , duration , completed , username],(err,result) =>{
    if(err){
      console.log(err);
    }else{
      console.log("Values inserted into",table);
      res.send("Values Inserted into Home Workout Table");
    }
  }
  )
  });

  app.get("/user/getcardio" , (req , res) => {
    const username = req.body.username;
    const query = `SELECT distance, calories, time, completed FROM running WHERE username = ${username} UNION ALL SELECT distance, calories, time, completed FROM cycling WHERE username = ${username};`
    db.query(query , (err , result) => {
      if(err){
        console.log(err);
      }else{
        console.log("Values fetched from all tables");
        res.send(result);
      }
    })
  });

  app.get("/user/getswim" , (req , res) => {
    const username = req.body.username;
    const query = `SELECT distance, calories, laps, time, completed FROM swimming WHERE username = ${username};`
    db.query(query , (err , result) => {
      if(err){
        console.log(err);
      }else{
        console.log("Values fetched from swimming tables");
        res.send(result);
      }
    })
  });

  app.get("/user/gethome" , (req , res) => {
    const username = req.body.username;
    const query = `SELECT types , sets , time , completed FROM homeworkout WHERE username = ${username};`
    db.query(query , (err , result) => {
      if(err){
        console.log(err);
      }else{
        console.log("Values fetched from swimming tables");
        res.send(result);
      }
    })
  });
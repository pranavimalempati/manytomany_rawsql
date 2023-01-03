const { client } = require("./db");

const express = require("express");
const main = express();
const router = require("./router/router");

require("dotenv").config();

const body_parser = require("body-parser");
const cors = require("cors");

main.use(body_parser.urlencoded({ extended: true }));
main.use(body_parser.json());
main.use("/", router);
main.use(cors());

async function run() {
  await client.connect((err)=>{
    if(err){
        return console.error("error: " + err.message);
    }else{
        console.log(`datasource initialized...`);
      let createmanager =`CREATE TABLE IF NOT EXISTS manager (
        m_id serial NOT NULL,
        m_name VARCHAR NOT NULL,
        m_age INTEGER NOT NULL,
        PRIMARY KEY (m_id)
     )`
     let createemployee = ` CREATE TABLE IF NOT EXISTS employee(
        emp_id serial NOT NULL,
       emp_name VARCHAR NOT NULL,
       emp_age INTEGER NOT NULL,
       PRIMARY KEY (emp_id)
    )`
    let link = `CREATE TABLE IF NOT EXISTS link (
        manager_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        PRIMARY KEY (manager_id, employee_id),
        FOREIGN KEY(manager_id) REFERENCES manager (m_id),
        FOREIGN KEY(employee_id) REFERENCES employee (emp_id)
     );`
     client.query(createmanager, function (err) {
        if (err) {
            console.log(err.message);
        }
    });
    client.query(createemployee, function (err) {
        if (err) {
            console.log(err.message);
        }
    });
    client.query(link, function (err) {
        if (err) {
            console.log(err.message);
        }
    });
    }
    console.log("tables created")
  });
  main.listen(process.env.PORT, () => {
    console.log('server running at port',process.env.PORT);
  });
}
run();


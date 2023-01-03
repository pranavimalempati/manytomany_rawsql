const { client } = require("../db");


const add = async (req, res) => {
    try {
        const {m_name,m_age,emp_name,emp_age,employee_id,manager_id} = req.body
        console.log("start excecution.......")
        let resp;
        if (m_name && m_age && emp_name && emp_age ){
            resp = await client.query(
                `INSERT INTO manager(m_name, m_age)VALUES ('${m_name}',${m_age});
                 
                INSERT INTO employee(emp_name, emp_age) VALUES ('${emp_name}',${emp_age});`)
        }else if(m_name && m_age){
             resp = await client.query(
            `INSERT INTO manager(m_name, m_age)VALUES ('${m_name}',${m_age});`);
        }else if(emp_name && emp_age){
            resp = await client.query(
               `INSERT INTO employee(emp_name, emp_age) VALUES ('${emp_name}',${emp_age})`);
        }else if (employee_id && manager_id ){
            resp = await client.query(
                `INSERT INTO link (manager_id, employee_id) VALUES 
                (${employee_id},${manager_id})`);
        }else{
            resp = "can't insert the data "
        }
        res.send(resp)
    } catch (error) {
        res.send(error.message)
    }
}


const manager = async (req,res) =>{
    try {
        const emp_age = req.body.emp_age
        console.log("start excecution.......")
        let result;
        const resp = await client.query(
            ` SELECT m_id,m_name,m_age, count (employee.emp_id) as ecount
        FROM manager LEFT JOIN link 
        on link.manager_id = manager.m_id 
        LEFT JOIN employee
        on employee.emp_id = link.employee_id 
                   and employee.emp_age>= ${emp_age} 
        GROUP BY m_id  
        Having   count (employee.emp_id) = 0
        ORDER BY m_id;`
        )
        if (resp.rowCount != 0){
            result = resp.rows
        }else{
            result = "no record found"
        }
        res.send(result )
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
}

const employee = async (req,res) =>{
    try {
        const num = req.body.num
        console.log("start excecution.......")
        let result;
       const resp = await client.query(
            ` SELECT emp_id,emp_name,emp_age,count(*) as cnt FROM employee
            INNER JOIN link
            ON link.employee_id =employee.emp_id
            GROUP BY emp_id
            HAVING COUNT(*) <= ${num}
            ORDER BY emp_id`
        )
        if (resp.rowCount != 0){
            result = resp.rows
        }else{
            result = "no record found"
        }
        res.send(result )
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
}


module.exports = {add,manager,employee}
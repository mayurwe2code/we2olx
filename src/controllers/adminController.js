import { json } from "express";
import connection from "../../Db.js";
import { jwtMaker } from "../common/jwtMaker.js";
import { queryListen } from "../common/querylistener.js";
import { resmsg } from "../common/resMsg.js";

export async function admin_login(req,res) {
   let {email,password} = req.body
   if(email && password){
    try {
        const query = `SELECT * FROM admin WHERE email = '${email.trim()}' AND password = '${password.trim()}' AND is_deleted != 1`
        let response = await queryListen(query);
        if(response.length){ 
           const jwttok = await jwtMaker({admin_id:response[0].admin_id,name:response[0].name})
            let sus = {status: true,message: 'Successfully Logged In',admin_id: response[0].admin_id,name: response[0].name,user_type: response[0].admin_type,token: jwttok}
              res.status(200).send(sus)
        }else{
            res.status(200).send(resmsg.invalidCred)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(resmsg.serverError);
    }
   }else{
    res.send({
        status: false,
        message: "Email and password are required!",
        data: []
   });
   }
}

export async function allEmployeeDetail(req,res) {
    let query = `SELECT * FROM employee`;
   let response = await queryListen(query)
   let respon;
   JSON.stringify("---chk------chk---"+response )
   if (response.length>0) {
     respon = {
        status: 1,
        message: "Employees found",
        data: response
    };
    res.status(200).send(respon)
} else {
     respon = {
        status: 0,
        message: "No Employee found",
        data: response
    };
    res.status(200).send(respon)
}

}
export async function allEmployeeSkill(req,res) {
    
    let query = `select employee_id, GROUP_CONCAT(skill SEPARATOR ", ") AS skills from  employee_skill GROUP BY employee_id`;
   let response = await queryListen(query)
   let respon;
   JSON.stringify("---chk------chk---"+response )
   if (response.length>0) {
     respon = {
        status: 1,
        message: "Employees found",
        data: response
    };
    res.status(200).send(respon)
} else {
     respon = {
        status: 0,
        message: "No Employee found",
        data: response
    };
    res.status(200).send(respon)
}

}


export async function allEmployeeCareer(req,res) {
    let query='SELECT * FROM employee_career'
   let response = await queryListen(query)
   if (response.length > 0) {
    const response1 = {
        status: 1,
        message: "Employees found",
        data: response
    };
    // Assuming you have a function to send the response, e.g., res.send(response)
    res.send(response1); // Replace with your actual response function and status code
} else {
    const response1 = {
        status: 0,
        message: "No Employee found",
        data: response
    };
    // Assuming you have a function to send the response, e.g., res.send(response)
    res.send(response1);
}
}


export async function allEmployeeEducation(req,res) {
    let query='SELECT * FROM employee_education'
   let response = await queryListen(query)
   if (response.length) {
    const response1 = {
        status: 1,
        message: "Employees found",
        data: response
    };
    // Assuming you have a function to send the response, e.g., res.send(response)
    res.status(200).send(response1); // Replace with your actual response function and status code
} else {
    const response1 = {
        status: 0,
        message: "No Employee found",
        data: response
    };
    // Assuming you have a function to send the response, e.g., res.send(response)
    res.status(200).send(response1); // Replace with your actual response function and status code
}

}

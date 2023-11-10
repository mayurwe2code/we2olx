import mysql from "mysql2";
import "dotenv/config";
import ReconnectCore from 'reconnect-core';
// node
// console.log();
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "we2code",
//   password: "we2code",
//   database: "nursery",
// });

// connection.connect((error) => {
//   if (error) throw error;
//   console.log("Successfully connected to the database.");
// });
// export default connection;

// export default function handleDisconnect() {


// var connection = mysql.createConnection({
//   host: "mysql.indiakinursery.com",
//   user: "indiakinursery",
//   password: "WE2code@2023",
//   database: "indiakinursery",
// });
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'we2code',
  password: "we2code",
  database: "we2olx",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});


// var connection = mysql.createConnection({
//   host: "b8ge1gim6edaq5jr1rht-mysql.services.clever-cloud.com",
//   user: "u9fe8rqvh3wh0bpk",
//   password: "pbzyUJkHu07N0RCQAG1t",
//   database: "b8ge1gim6edaq5jr1rht",
// });

connection.connect(function (err) {
  console.log("connect-1--------------------------29")
  if (err) {
    console.log('error when connecting to db:', err);
    setTimeout(connection.connect(), 2000);
  }
});
connection.on('error', function (err) {
  console.log('db error', err);
  connection.connect()
});

export default connection;

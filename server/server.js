// /* eslint-disable camelcase */
// const express = require('express');
// const fileUpload = require('express-fileupload');
// const xlsx = require('xlsx');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();
// const port =  8000;
// // const port = 7070;
// app.use(fileUpload());
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

// app.post('/upload', (req, res) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }

//   const excelFile = req.files.file; 
//   const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
//   const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//   const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//   res.json({ data: jsonData });
// });
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // const fs = require('fs');
// // const https = require('https');
// // const express = require('express');
// // const fileUpload = require('express-fileupload');
// // const xlsx = require('xlsx');
// // const bodyParser = require('body-parser');
// // const cors = require('cors');
// // const path =require('path')

// // const app = express();
// // const port = 8000;

// // // SSL certificate and key paths
// // const sslOptions = {
// //   key: fs.readFileSync(path.join(__dirname,'cert','private-key.pem')), // Replace with the path to your private key
// //   cert: fs.readFileSync(path.join(__dirname,'cert','csr.pem')), // Replace with the path to your certificate
// // };

// // app.use(fileUpload());
// // app.use(cors());
// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(express.json());

// // app.post('/upload', (req, res) => {
// //   if (!req.files || Object.keys(req.files).length === 0) {
// //     return res.status(400).send('No files were uploaded.');
// //   }

// //   const excelFile = req.files.file;
// //   const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
// //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
// //   const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

// //   res.json({ data: jsonData });
// // });

// // // Create an HTTPS server with SSL configuration
// // const server = https.createServer(sslOptions, app);

// // server.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });

const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

exports.handler = async (event) => {
  if (!event.body || !event.body.file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No files were uploaded.' }),
    };
  }

  const excelFile = Buffer.from(event.body.file, 'base64');
  const workbook = xlsx.read(excelFile, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  return {
    statusCode: 200,
    body: JSON.stringify({ data: jsonData }),
  };
};

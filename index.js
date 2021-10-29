//require("dotenv").config();
const fs = require("fs");
const http = require("http");
const path = require('path');
const url = require('url');
const express = require("express");
const cors = require("cors");
//const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Your app is running with ${port}`));

const createDir = (dirPath) => {
    fs.mkdirSync(process.cwd() + dirPath, {recursive : true}, (error) => {
        if(error){
            console.error('An error occured: ', error);
        } else{
            console.log(`Your directory is created with name '${dirPath}'`)
        }
    })
}

const createFile = (filePath, fileContent) => {
    let fileName = process.cwd() + filePath+ '/'+Date.now()+'-date-time.txt'
    console.log(fileName);
    fs.writeFile(fileName, fileContent, (error) => {
        if(error){
            console.error('An error occured: ', error);
        } else{
            console.log(`Your file is created with name '${fileName}'`)
        }
    })
}

const dateTime = () => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

}

app.get("/", function (req, res) {

        res.json({
            output: "Homepage"
        });

  });
// endpoint for retrieve all file from folder
app.get("/getAllFiles", function (req, res) {
    let filesFolders = [];
    let dir = './fileFolder/';
    if(req.query.path != null){
        dir += `${req.query.path}/`;
        console.log(dir)
    }
    fs.readdir(dir, (err, files) => {
        if (err) { throw err; };
        files.forEach(file => {
            let type = path.extname(file);
            let detail = {"name" : file, "type": type}
            filesFolders.push(detail);
        });
        res.json({
            data: filesFolders
        });
    });
  });

  app.get("/createFolder", function (req, res) {
    let dir = '/fileFolder/';
    if(req.query.path != null){
        dir += `${req.query.path}/`;
        console.log(dir)
    }
    let fileOutput = createDir(`${dir}/${Date.now()}`);
        if(fileOutput){
            res.json({
                    result: 'Folder CREATED',
            }) 
        } else{
            res.json({
                    result: 'FAILED',
            })
        }
  });

  app.get("/createNewFile", function (req, res) {
    let dir = '/fileFolder/';
    if(req.query.path != null){
        dir += `${req.query.path}/`;
        console.log(dir)
    }
    const content = dateTime();
    let fileOutput = createFile(dir, content);
    if(fileOutput){
        res.json({
                result: 'File CREATED',
        }) 
    } else{
        res.json({
                result: 'FAILED',
        })
    }
  });
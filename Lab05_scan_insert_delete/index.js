const express = require('express');
const app = express();

const PORT = 3000;
const path = require("path");

//const port = 3000

app.use(express.json({ extended: false}));
app.use(express.static('./views'));
app.set('view engine','ejs');
app.set('views','./views');

// config aws dynamodb

const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId:'',
    secretAccessKey:'',
    region:'ap-southeast-1'
});

//query database
AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'SanPham';

const multer = require('multer');
const upload = multer();


app.get('/', (req, res) => {
 const params ={
    TableName : tableName,
 };
 docClient.scan(params,(err,data)=>{
    if(err){
        res.send('Internal server error!');
    }else{
        return res.render('index',{sanPhams: data.Items});
    }
 });
});

app.get("/addPrd", (req, res) => {
    res.render("add");
});

app.post('/add_sp', upload.fields([]), (req, res) => {
    const { ma_sp, ten_sp, so_luong } = req.body;
    const params = {
        TableName: tableName,
        Item: {
            "ma_sp": ma_sp,
            "ten_sp": ten_sp,
            "so_luong": so_luong
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {
            console.log(err.message)
            return res.send('Internal Server Error')
        } else {
            return res.redirect("/");
        }
    })
});

app.get("/delete/:ma_sp", (req, res) => {
    const ma_sp = req.params.ma_sp;
    console.log(ma_sp);

    const params = {
        TableName: tableName,
        Key: {
            ma_sp: ma_sp,
        },
    };

    docClient.delete(params, (err, data) => {
        if (err) {
            console.log(err.message);
            res.send("Internal server error");
        } else {
            console.log(data);
            return res.redirect("/");
        }
    });
});

app.listen(PORT, () => console.log(`App listening port -> ${PORT}`));
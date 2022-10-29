const express = require("express");
const app = express();

app.use(express.json({ extended: false }));
app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

//Config aws dynamodb
const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId:'',
    secretAccessKey:'',
    region:'ap-southeast-1'
});
AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'BaiBao';

const multer = require('multer');
const { request, response } = require('express');
const upload = multer();

app.get('/', (request, response) => {
    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const t = data.Items[0];
            console.log(typeof(t.id) + "id");
            console.log(typeof(t.isbn) + "isbn");
            console.log(typeof(t.so_trang) + "so_trang");
            console.log(typeof(t.nam_sx) + "nam-sx");

            return response.render('index', { baiBaos: data.Items });
        }
    });
});

app.post('/', upload.fields([]), (req, res) => {
    const { id, ten_bao, ten_tg, isbn, so_trang,nam_sx } = req.body;
    const params = {
        TableName: tableName,
        Item: {
            id: parseInt(id),
            ten_bao,
            ten_tg,
            isbn: parseInt(isbn),
            so_trang: parseInt(so_trang),
            nam_sx: parseInt(nam_sx),
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {

            res.send('Lỗi ở phần post(thêm) item ');
            return console.log(err);
        } else {
            return res.redirect("/");
        }
    })
});


app.get("/add", (request, response) => {
    response.render('add');
});

app.post("/delete", upload.fields([]), (req, res) => {
    const listItems = Object.keys(req.body);

    if (listItems.length === 0) {
        return res.redirect('/');
    }

    function onDeleteItem(index) {
        const params = {
            TableName: tableName,
            Key: {
                id: parseInt(listItems[index]),
            }
        }
        docClient.delete(params, (err, data) => {
            if (err) {
                res.send('Lỗi ở phần delete(xóa) item ');
                return console.log(err);
            } else {
                if (index > 0) {
                    onDeleteItem(index - 1);
                } else {
                    return res.redirect('/');
                }
            }
        })
    }
    onDeleteItem(listItems.length - 1);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

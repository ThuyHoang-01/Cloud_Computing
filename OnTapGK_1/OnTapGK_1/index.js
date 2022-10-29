const express = require('express')
const app = express()


app.use(express.json({ extended: false}));
app.use(express.static('./views'));
app.set('view engine','ejs');
app.set('views','./views');
// config aws dynamodb
const AWS = require('aws-sdk')
const config = new AWS.Config({
    accessKeyId:'',
    secretAccessKey:'',
    region:'ap-southeast-1'
});
AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'BaiBao';

const multer = require('multer');

const upload = multer();

app.get('/', (request, response) => {
    //query database
    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            response.send('Internal Server Error');
        } else {
            return response.render('index', { baiBaos: data.Items });
        }
    });
});
// Get Form add
app.get("/add", (req, res) => {
    res.render('add');
});

//update
app.post('/add', upload.fields([]), (req, res) => {
    const { id, ten_bao, ten_tg, isbn, so_trang,nam_sx } = req.body;
    const params = {
        TableName: tableName,
        Item: {
            "id": id,
            "ten_bao": ten_bao,
            "ten_tg": ten_tg,
            "isbn": isbn,
            "so_trang": so_trang,
            "nam_sx": nam_sx,
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

app.listen(3000, () => {
  console.log(`Example app listening on port 3000!`);
})

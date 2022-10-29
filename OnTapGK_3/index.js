const express = require('express')
const app = express();

app.use(express.json({extended: false}));
app.use(express.static('./views'));
app.set('view engine','ejs');
app.set('views','./views');

//config aws dynamodb
const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId:'',
    secretAccessKey:'',
    region:'ap-southeast-1'
});
 AWS.config = config;
//Query database
const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'NhanVien';

const multer = require('multer');
const upload = multer();

app.get('/',  (req, res) => {
  const params = {
    TableName : tableName,
  };

  docClient.scan(params,(err,data) =>{
    if(err){
        res.send('Internal Server Error');
    }
    else{
        return res.render('index',{nhanViens: data.Items});
    }
  });
});



//post

app.post('/', upload.fields([]), (req, res) => {
    const { id, name , address} = req.body;
    const params = {
        TableName: tableName,
        Item: {
            id,
            name,
            address,
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

app.post('/delete', upload.fields([]), (req,res)=>{
    const listItems = Object.keys(req.body);

    if(listItems.length == 0){
        return res.redirect("/");
    }

    function onDeleteItem(index){
        const params = {
            TableName:tableName,
            Key:{
                "id":listItems[index]
            }
        }

        docClient.delete(params,(err, data) => {
            if(err){
                return res.send('Internal Server Error');
            }
            else{
                if(index > 0){
                    onDeleteItem(index - 1);
                }else{
                    return res.redirect("/");
                }
            }
        })
    }
    onDeleteItem(listItems.length - 1);
});


app.listen(3000 ,() =>{
    console.log('Server is running on port 3000!');
});
const joi=require('joi')
const express=require('express');
const path = require('path')
const env=require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app=express();
const session = require('express-session');
const validresult=require('express-validator')
const MongoStore = require('connect-mongo');
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const U_routes=require('./routes/user')// imported routes
const A_routes=require('./routes/admin/user');
const C_routes=require('./routes/category');

//helllllloooo
//hello basit 
//this also works fine lekin aik developed library h for parsing toh use that
//app.use(express.json());
//middleware is used for manipulation b/w a request making and halding request
app.use(express.json());

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:1234@cluster0.qrcaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
        ttl: 14 * 24 * 60 * 60,//time to live for a session
        autoRemove: 'native' 
    })
  }));
app.use(express.json());
//app.use(bodyParser());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
//mongodb+srv://admin:<password>@cluster0.qrcaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
var mongoDB = 'mongodb+srv://admin:1234@cluster0.qrcaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, 
    {useNewUrlParser: true, 
    useUnifiedTopology: true,
     }).then(()=>{
    console.log('Database connected');
    });


/*
sample routes
app.get('/', (req,res,next)=>{
  res.status(200).json({
      message:"Hello from server"
  })
});

app.post('/data',(req,res,next)=>{
    res.status(200).json({
        //this will return an empty object if not parsed
        message: req.body
    })
})
*/

app.use('/api', U_routes);
app.use('/api', A_routes);
app.use('/api', C_routes);
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});



var express = require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');const passport=require('passport')
const rIndex=require('./routes/index')
const rAdd=require('./routes/add')
const rUsers=require('./routes/user')
const rAuth=require('./routes/auth_pro')
const expressValidator=require('express-validator')
const session=require('express-session')


var app = express();


app.use(require("connect-flash")())
app.use(function(req,res,next){
    res.locals.messages=require('express-messages')(req,res)
    next()
})

app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true,
}))

app.use(expressValidator({
    errorFormatter:(param,msg,value)=>{
        let namespace=param.split('.')
            root=namespace.shift()
            formParam=root
            while(namespace.length){
                formParam+='['+namespace.shift()+']'
            }
            return{
                param:formParam,
                msg:msg,
                value:value
            }
    }
}))


const database=require("./helper/db")
mongoose.connect(database.db,{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})

const db=mongoose.connection

db.on('open',()=>{
    console.log('MongoDb running')
})
db.on('error',(err)=>{
    console.log('MongoDb error')
})
///setting engine
app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'))

///settings body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

///setting static folders
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname)))


//Authentificate
require('./md/passport')(passport);
app.use(passport.initialize())
app.use(passport.session())

app.get('*',(req,res,next)=>{
    res.locals.user=req.user||null;
    next() })

// app.use(function(req,res,next){
//     res.locals.currentUser=req.user
//     next()
//   })
// app.get('*', function(req, res,next){
//     res.locals.user = req.user || null;
//     next();
// })

app.use(rIndex)
app.use(rAdd)
app.use(rUsers)
app.use(rAuth)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;

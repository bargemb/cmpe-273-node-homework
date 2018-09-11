var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret:'My$3cr3t',
    resave:false,
    saveUninitialized:true
    }
));

var users = [
    {
    "username" : "admin",
    "password" : "admin"
    }
];

var students = [];
app.get('/', function(req, res){
    if(req.session.user){
        res.redirect('create');
    }else {
        res.render('login');
    }
});

app.post('/login',function(req, res){
    if(req.session.user){
        res.render('create');
    }else{
        users.filter(function(user){
            if(user.username === req.body.username && user.password === req.body.password){
                req.session.user = user;
                res.redirect('create');
            }
            else {
                res.render('login',{
                    "invalidCred" : "Invalid Username OR Password"
                });
            }
        })
    }
});

app.get('/create',function(req, res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        res.render('create');
    }
});

app.post('/create',function(req, res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        var newStudent = {stuName: req.body.stuName, stuId: req.body.stuId, department : req.body.deptName};
        students.push(newStudent);
        res.render('report',{
            students: students
        });
    }
});

app.get('/report',function(req, res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        res.render('report',{
            students: students
        });
    }
});

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");

});
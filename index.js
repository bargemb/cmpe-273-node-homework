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
    }else{
        res.render('login');
    }
});

app.get('/login', function(req, res){
    if(req.session.user){
        res.redirect('create');
    }else{
        res.redirect('/');
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
            }else{
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
        if(students.find(function (stu) {
            return stu.stuId == req.body.stuId;
        })){
            console.log(req.body);
            res.render('create',{
                "duplicate": "Student ID already exist"
            });
        }else{
            console.log(req.body);
            var newStudent = {stuName: req.body.stuName, stuId: req.body.stuId, department : req.body.deptName};
            students.push(newStudent);
            res.redirect('report');
        }
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

app.post('/delete',function(req, res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        var index = students.map(function(student){
            return student.stuId;
        }).indexOf(req.body.dbutton);
        console.log(students[index]);
        students.splice(index, 1);
        res.render('report',{
            students: students
        });
    }
});

app.get('*', function(req, res){
    res.redirect('/');
});

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");

});
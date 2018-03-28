var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var path = require('path');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var fb = require("./firebase.js");
var session = require('express-session');

app.use(session({secret:"blah",resave:false,saveUninitialized:false }));

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
	extended: true
}));
	
var firebase = fb.fb();
var ref = firebase.database().ref().child('Project');

app.post('/tasks', function(request, response){
  var full = "";
  var year = new Date().getFullYear().toString();
  var day = new Date().getDay().toString();
  var month = new Date().getMonth().toString();
  full = year.concat('/', day, '/', month);
  console.log(request.session.user); 
  var ref = firebase.database().ref().child('Project').child(request.session.user);
  ref.child(request.body.key).child('Time').set(full);
  // response.render('projEd.ejs', {key:request.body.key, ref:ref, name:request.body.ProjectN, description:request.body.ProjectD, users:request.body.ProjectU});
    // response.render('index', data);
    ref.child(request.body.key + "/ProjectTasks").once('value', function(snapshot){   
    var data ={
      tasks: []
    };  

    snapshot.forEach(function(childSnapshot) {
      data.tasks.push({
        "key": childSnapshot.key,
        "value": childSnapshot.val()
      });
  });
    response.render('tasks.ejs', data);
  });
});

app.get('/projects', function(request, response){
  	var store = {};
  	var i = 0;
  	var ref2 = firebase.database().ref().child('Current').child('idT');
	var ref = firebase.database().ref().child('Project');
	
	ref2.on('value', function(snap){
		var store = snap.val();
		request.session.user = store;

		if(request.session.user){
			response.render('projects.ejs', {ref:ref, store:store, uId:request.session.user});			
		}else{
			response.redirect('/');
		}
	});
	// ref.on('value', function(snap){
	// 	project = snap.val();
	// 	response.render('index.ejs', {desc:project['Project Description'], name:project['Project Name'], user:project['Project Users']});
	// });
});


app.get('/',function(request, response){
	response.render('index.ejs');
});

app.get('/signup',function(request, response){
	response.render('signup.ejs');
});

app.get('/home',function(request, response){
	response.redirect('/projects');
});

app.get('/insert',function(request, response){
	response.render('insert.ejs');
});

app.post('/insertProj', function(request, response){
	console.log(request.session.user);
	var ref = firebase.database().ref().child('Project').child(request.session.user);
	console.log(request.body.filetemp);
	var proj = {ProjectName:request.body.ProjName, ProjectDescription:request.body.ProjDesc, ProjectTasks:request.body.tasks};
	var refs = ref.push(proj);
	var store = {};
	ref.child(refs.key).set(proj);
	response.redirect('/projects');
});

app.get('/logout', function(request, response){
	if (request.session) {
    // delete session object
	    request.session.destroy(function(err) {
	      if(err) {
	        next(err);
	      } else {
	      	isLoggedin = false
	        response.redirect('/');
	      }
    });
  }
});

// app.post('/projEd', function(request, response){
	
// });

app.listen(3000, function(){
	console.log("Listening on port 3000");
});

exports.fb = function(){
	var firebase = require('firebase').initializeApp({
  	serviceAccount: "projectmanagementsystem-a5f09-export.json",
  	databaseURL: "https://projectmanagementsystem-a5f09.firebaseio.com/"
	});	
	return firebase;
}

exports.files = function(){
	var firebase = require('firebase').initializeApp({
		serviceAccount: "",
		
	});
	return firebase;
}
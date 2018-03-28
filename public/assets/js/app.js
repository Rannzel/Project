function submitUser() {
    var fname = document.getElementById("first_name").value;
    var lname = document.getElementById("last_name").value;
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password =  document.getElementById("password").value;
    var Project = document.getElementById("Project Name").value;
    var submit = document.getElementById("submit");
    var _error = document.getElementById("_error");
  
    var rootdb = firebase.database().ref();
    var userref = rootdb.child('Users');
 
     firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
       if(user){
          console.log("Hi!!");
          var rootDB = firebase.database().ref();
          var usersRef = rootDB.child('Users');
          var id = user.uid;
     
          usersRef.child(id).set({
             token : id,
             firstname : fname,
             lastname : lname,
             email : email,
             username : username,
             Project : Project,
             first_login : 0
          }).then(function(a){
             console.log("Na insert na!");
               window.location.href = "\signup";
          });
       }else{
          console.log("Walay user!");
       }
    }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       console.log(errorCode);
       console.log(errorMessage);
       // ...
    });
 }
 
 function loginUser() {
   var email = document.getElementById("email").value;
   var email_error = document.getElementById("email_error");
   var password =  document.getElementById("password").value;
   var password_error = document.getElementById("password_error");
 
   firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
     email_error.classList.add("hidden");
     password_error.classList.add("hidden");
     var id = user.uid;
     console.log("User id:");
     console.log(id);
     var rootDB = firebase.database().ref();
     var usersdb = rootDB.child('Users');
     //Query starts
     usersdb.orderByChild('token').equalTo(id).on("value", function(snapshot) {
       var value = snapshot.val();
       console.log(value);
       var key = Object.keys(snapshot.val())[0];
       var ref = firebase.database().ref().child('Current');
       ref.set({idT:id});       
       console.log(key);
       var firstname = snapshot.child(key).child('firstname').val();
       var numOfLogin = snapshot.child(key).child('first_login').val();
       console.log(firstname);
       if (numOfLogin == 0) {
         usersdb.child(key).update({
           "first_login" : 1
         });
         console.log("Redirecting to About...");
        window.setTimeout(function(){
           // Move to a new location or you can do something else
           window.location.href = "\home";
         }, 3000);
       }else if(numOfLogin == 1){
         console.log("Redirecting to Home...");
         window.setTimeout(function(){
           // Move to a new location or you can do something else
           window.location.href = "\home";
         }, 3000);
       }
     });
     //Query ends
     
     //Catching error...
     }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       console.log(errorCode);
       console.log(errorMessage);
       if (errorCode == "auth/user-not-found" || errorCode == "auth/invalid-email") {
         email_error.classList.remove("hidden");
         password_error.classList.add("hidden");
       }else if (errorCode == "auth/wrong-password") {
         password_error.classList.remove("hidden");
         email_error.classList.add("hidden");
       }
     });
 }
 
 function getCurrentUser() {
   //var user = firebase.auth().currentUser;
   var email = document.getElementById("email");
   firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
       // User is signed in.
       //console.log(user.email);
       email.textContent = user.email;
     } else {
       // No user is signed in.
       console.log("Walay user sa about...");
     }
   });
 }
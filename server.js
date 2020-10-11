const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server,{
  debug: true
});
var pvcId;


var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");
var firebaseConfig = {
    apiKey: "AIzaSyCX3WswT80UDobglPwegNTIISP5id1DGIM",
    authDomain: "alchemist-cnibp.firebaseapp.com",
    databaseURL: "https://alchemist-cnibp.firebaseio.com",
    projectId: "alchemist-cnibp",
    storageBucket: "alchemist-cnibp.appspot.com",
    messagingSenderId: "362504833289",
    appId: "1:362504833289:web:dc5e78923b889ed2c16bd8",
    measurementId: "G-FV315WYR11"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
/*
var uid,serverRef,target,newRef;
serverRef = firebase.database().ref();
firebase.auth().onAuthStateChanged((user)=>{
    //if (user) {
    //   User is signed in.
   // console.log(user);
         user = firebase.auth().currentUser;
         //uid
         console.log(user);
        if(user != null){
            uid = user.uid;
            console.log(uid);
        }
      //}
      })
       uid = "uWQyAnh1L5QcjNAfQGS2iUBqdtR2"
      console.log(uid);        
var x=1;
 serverRef.child("Doctors").child(uid).child("APPOINTMENTS").child("CURRENT").on('value',function(snap){
    target = snap.val();
    //target = target.TWO;
    console.log(target.ONE);
})*/

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get('/', (req, res) => {
   // pvcId = uuidV4();
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
  //newRef = serverRef.child("Patients").child(target.ONE).child("APPOINTMENTS");  
    //newRef.set({ONE:pvcId})
    //console.log(pvcId);
   // console.log(roomId);
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected',
      userId)
    })
  });
});

server.listen(process.env.PORT||3030);

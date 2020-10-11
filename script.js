// ECG_Graph
var contentInnerWidth = $(".mrMiddles").innerWidth();
var contentInnerHeight = $(".mrMiddles").innerHeight();
var config = {
  scrollZoom: true,
  displaylogo: false,
  responsive: true,
  autosize: true,
};
var layout = {
  width: 510,
  height: 130,
  margin: {
    t: 30, //top margin
    l: 23, //left margin
    r: 20, //right margin
    b: 20, //bottom margin
  },
  xaxis: {
    linecolor: "#141717",
    linewidth: 2,
  },
  yaxis: {
    linecolor: "#2C3335",
    linewidth: 2,
  },

  plot_bgcolor: "#141717",
  paper_bgcolor: "#141717",
  title: "ECG",
  titlefont: {
    size: 20,
    family: "digital",
  },
};
function getData() {
  return Math.random();
  // return 1;
}
Plotly.plot(
  "chart",
  [
    {
      y: [getData()],
      type: "line",
      line: {
        color: "#10A881",
      },
    },
  ],
  layout,
  config
);
var cnt = 0;
setInterval(function () {
  Plotly.extendTraces("chart", { y: [[getData()]] }, [0]);
  cnt++;
  if (cnt > 100) {
    Plotly.relayout("chart", {
      xaxis: {
        range: [cnt - 100, cnt],
      },
    });
  }
}, 15);
$(window).resize(function () {
  // Getting the height of the window
  var windowheight = $(".mrMiddles").height();

  // Apply window height to .content
  $(".mrMiddles").css({
    height: windowheight + "px",
  });

  // Getting the width of .content
  var contentInnerWidth = $(".mrMiddles").innerWidth();

  // Apply width and height to two divs that are created by
  // Plotly. Fixed some issueswith hidden overfull elements.
  $(".js-plotly-plot").css({
    width: contentInnerWidth + "px",
    height: windowheight + "px",
  });
  $(".plotly").css({
    width: contentInnerWidth + "px",
    height: windowheight + "px",
  });

  // Applying width and height to a new variable for Plotly
  var update = {
    width: contentInnerWidth,
    height: windowheight,
  };
  // Using Plotly's relayout-function with graph-name and
  // the variable with the new height and width
  //Plotly.relayout(gd, update);
});

/////////////////////////////////////////////////////////////////////////
var rootRef = firebase.database().ref();
var fireVal;
rootRef.child('Patients').child(ROOM_ID).child('Data').on('value',function(snap){
console.log(snap.val());
fireVal = snap.val();
console.log(fireVal.sbp);
document.querySelector('#sys').innerHTML = fireVal.sbp;
document.querySelector('#dia').innerHTML = fireVal.dbp;
document.querySelector('#hr').innerHTML = fireVal.hr;
//document.querySelector('#sys').innerHTML = fireVal.sys;
//document.querySelector('#sys').innerHTML = fireVal.sys;

})
 

// patientScreenDrag
var element = document.getElementById("selfVideo");
var grid = document.getElementById("video-grid");
var options = { limit: null };
//new Draggable(element, options);

//nodeJs
const socket = io('/');
const myPeer = new Peer(undefined, {
  path :'/peerjs',
  host: '/',
  port: '443'
});
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-connected", (userId) => {
  console.log("User connected: " + userId);
});



//myvideo
const myvideo = document.createElement('video');
myvideo.muted = true;
const peers = {}

navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true

}).then(stream => {
    addVideoStream(myvideo,stream)

    myPeer.on('call',call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream',userVideoStream => {
        UserVideoStream(video,userVideoStream)
      })

    })

    socket.on('user-connected',userId => {
      connectToNewUser(userId,stream)
    })
    
})

socket.on('user-disconnected',userId => {
  //console.log(userId);
  if(peers[userId]) peers[userId].close()
})

function connectToNewUser(userId,stream){
  const call = myPeer.call(userId,stream)
  const video = document.createElement('video')
  call.on('stream',userVideoStream => {
    UserVideoStream(video,userVideoStream)
  })
  call.on('close',() => {
    video.remove()
    //if on close , u wish to display some pic do it here
  })

  peers[userId] = call
}

function addVideoStream(video,stream){
  video.srcObject = stream
  video.addEventListener('loadedmetadata',() => {
    video.play();
  })
  element.append(video)
}
function UserVideoStream(video,stream){
  video.srcObject = stream
  video.addEventListener('loadedmetadata',() => {
    video.play();
  })
  grid.append(video)
}
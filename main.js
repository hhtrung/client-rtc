const socket = io("http://localhost:3003");

socket.on("DANH_SACH_ONLINE", (arrUserInfo) => {
  $("#ulUser").html();
  arrUserInfo.forEach((user) => {
    const { ten, peerId } = user;
    $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
  });
});

function openStream() {
  const config = { audio: false, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  console.log("video in playStream function: ", video);
  video.srcObject = stream;
  video.play();
}

// openStream().then((stream) => playStream("localStream", stream));

var peer = new Peer({
  key: "peerjs",
  host: "my-peer-1206.herokuapp.com",
  secure: true,
  port: 433,
});
peer.on("open", (id) => {
  $("#my-peer").append(id);
  $("#btnSignUp").click(() => {
    const username = $("#txtUsername").val();
    socket.emit("NGUOI_DUNG_DANG_KY", { ten: username, peerId: id });
  });
});

//caller
$("#btnCall").click(() => {
  const id = $("#remoteId").val();
  openStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

//receiver
peer.on("call", (call) => {
  openStream().then((stream) => {
    call.answer(stream);
    playStream("localStream", stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

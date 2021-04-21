<template>
  <div>
    <video autoplay id="video" playsinline></video>
    <video
      v-for="[i, u] of otherVideos"
      :key="i"
      autoplay
      :ref="u"
      playsinline
    ></video>
  </div>
</template>

<script>
import Socket from "@/lib/socket.js";
export default {
  name: "Room",
  data: () => ({
    userVideo: null,
    otherVideos: null,
    peers: [],
    users: [],
    socket: null,
    userStream: null,
    ID: null,
  }),

  mounted() {
    this.userVideo = document.getElementById("video");
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.userVideo.srcObject = stream;
        this.userStream = stream;

        this.socket = new Socket("ws://localhost:7070/ws", (s) => {
          console.log("Connected to server");
          const id = this.$route.path.substring(
            this.$route.path.lastIndexOf("/") + 1
          );

          s.on("join_room", (event) => {
            this.ID = event.user_id;
            console.log(event, "join_room");
          });

          s.on("new_user", (event) => {
            this.users.push(event.user_id);
          });

          s.on("offer", this.handleRecieveCall);

          s.send("join_room", { room_id: id });
        });
        console.log(this.socket);
      });
  },

  methods: {
    callUser(id) {
      this.peers.push(this.createPeer(id));
      this.userStream.getTracks().forEach((track) => {
        for (const peer of this.peers) {
          peer.addTrack(track, this.userStream);
        }
      });
    },
    createPeer(id) {
      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.stunprotocol.org" },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
        ],
      });
      peer.onicecandidate = this.handleIceCandidate;
      peer.ontrack = this.handleTrack;
      peer.onnegotiationneeded = () => this.handleNegotiation(id);

      return peer;
    },

    handleIceCandidate() {},

    handleTrack() {},

    handleNegotiation(id) {
      for (const peer of this.peers) {
        peer
          .createOffer()
          .then((offer) => {
            return peer.setLocalDescription(offer);
          })
          .then(() => {
            const payload = {
              target: id,
              caller: this.ID,
              sdp: peer.localDescription,
            };
            this.socket.send("offer", payload);
          })
          .catch((e) => console.error(e));
      }
    },

    handleRecieveCall(event) {
      const peer = this.createPeer();
      const desc = new RTCSessionDescription(event.sdp);
      peer
        .setRemoteDescription(desc)
        .then(() => {
          this.userStream
            .getTracks()
            .forEach((track) => peer.addTrack(track, this.userStream));
        })
        .then(() => {
          return peer.createAnswer();
        })
        .then((answer) => {
          return peer.setLocalDescription(answer);
        })
        .then(() => {
          const payload = {
            target: event.caller,
            caller: this.ID,
            sdp: peer.localDescription,
          };
        });
    },
  },
};
</script>

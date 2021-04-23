<template>
  <div>
    <video autoplay id="video" playsinline></video>
    <video
      v-for="[i, u] of otherVideos"
      :key="i"
      autoplay
      :src="u"
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
    otherVideos: {},
    peers: {},
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
            this.users = event.other_users;
            if (event.other_users.length < 2) {
              return;
            }
            for (const x of event.other_users) {
              if (x === this.ID){
                continue
              }
              this.callUser(x.id)
            }
          });

          s.on("new_user", (event) => {
            this.users.push(event.user_id);
          });

          s.on("offer", this.handleReceiveCall);

          s.on("answer", this.handleAnswer);

          s.on("ice-candidate", this.handleIceCandidateMsg);

          s.send("join_room", { room_id: id });
        });
        console.log(this.socket);
      });
  },

  methods: {
    callUser(id) {
      this.peers[id] = this.createPeer(id);
      this.userStream.getTracks().forEach((track) => {
        // eslint-disable-next-line no-unused-vars
        for (const [i, peer] of Object.entries(this.peers)) {
          peer.addTrack(track, this.userStream);
        }
      });
    },
    createPeer(id) {
      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
        ],
      });
      peer.user_id = id;

      this.otherVideos[peer.user_id] = new MediaStream();

      peer.onicecandidate = this.handleIceCandidate;
      peer.ontrack = (e) => {
        this.otherVideos[peer.user_id] = e.streams[0];
      };
      peer.onnegotiationneeded = () => this.handleNegotiation(id);

      return peer;
    },

    handleIceCandidate(event) {
      if (event.candidate) {
        let id = this.ID;
        const payload = {
          target: event.target.user_id,
          from: id,
          candidate: event.candidate,
        };
        this.socket.send("ice-candidate", payload);
      }
    },

    handleIceCandidateMsg(event) {
      console.log(event, event.from.toString(), this.peers);
      // eslint-disable-next-line no-unused-vars
      for (const [i,x] of Object.entries(this.peers)){
        console.log(i === event.from);
      }
      const candidate = new RTCIceCandidate(event.candidate);
      this.peers[event.from]
        .addIceCandidate(candidate)
        .catch((e) => console.error(e));
    },

    handleNegotiation(id) {
      // eslint-disable-next-line no-unused-vars
      for (const [i, peer] of Object.entries(this.peers)) {
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

    handleReceiveCall(event) {
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
          this.socket.send("answer", payload);
          this.peers[event.caller] = peer;
        });
    },
    handleAnswer(event) {
      const desc = new RTCSessionDescription(event.sdp);
      this.peers[event.caller].setRemoteDescription(desc).catch((e) => {
        console.error(e);
        console.log(event, this.ID);
      });
    },
  },
};
</script>

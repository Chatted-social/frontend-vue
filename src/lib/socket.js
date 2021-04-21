export default class Socket {
  constructor(url, onopen) {
    this.ws = null;
    this.handlers = {};
    this.connect(url, onopen);
  }
  onerror(err) {
    console.error(err);
  }
  onclose(err) {
    console.log(err);
  }
  on(eventType, handler) {
    this.handlers[eventType] = handler;
  }
  connect(url, onopen) {
    let ws = new WebSocket(url);
    ws.onopen = () => {
      onopen(this);
    };
    ws.onerror = (err) => {
      this.onerror(err);
    };
    ws.onclose = (err) => {
      this.onclose(err);
    };
    ws.onmessage = (msg) => {
      console.log(msg);
      let event = JSON.parse(msg.data);
      this.handlers[event.event_type](event.data);
    };
    this.ws = ws;
  }
  send(eventType, data) {
    this.ws?.send(JSON.stringify({ event_type: eventType, data: { ...data } }));
  }
  close() {
    this.ws?.close();
  }
}

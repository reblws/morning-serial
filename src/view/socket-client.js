import io from 'socket.io-client';
import { host } from '../config/view';

class SocketClient {
  constructor() {
    this.socket = null;
  }

  // Opens a socket io connections
  open(rooms, callback) {
    this.socket = io(host);
    this.socket.emit('i want to join', rooms);
    this.socket.on('new article', callback);
  }

  leave(room) {
    if (!this.socket) {
      throw new Error("Can't leave room, socket not opened");
    }
    this.socket.emit('i want to leave', room);
  }

  join(room) {
    if (!this.socket) {
      throw new Error("Can't join room, socket not opened.")
    }
    this.socket.emit('i want to join', room);
  }

  close() {
    this.socket.disconnect();
    this.socket = null;
  }

  exists() {
    return this.socket !== null;
  }
}

export default new SocketClient();

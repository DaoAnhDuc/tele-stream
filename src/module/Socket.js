import { notification } from 'antd';
import io from 'socket.io-client';
import { Notification } from './Notification';

class SocketClone {
  constructor(url) {
    this.socket = io.connect(url);
  }

  request = (type, data = {}) => {
    return new Promise((resolve, reject) => {
      this.socket.emit(type, data, (data) => {
        if (data.status===0) {
          Notification("error",data.message)
          // resolve(data.data)
          reject(data.data)
        } else {
          resolve(data.data)
        }
      })
    })
  }

}

export { SocketClone }
import {io} from 'socket.io-client'

export const socket = io("http://localhost:4002", {
  withCredentials: true,
  transports:["websocket","polling"],
  autoConnect:true
});
import socketIoClient from "socket.io-client"
const socketio = socketIoClient("http://localhost:3001")
export default socketio;
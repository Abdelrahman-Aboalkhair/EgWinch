import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

let socket: Socket | undefined;

export const initSocket = (userId: string): Socket => {
  if (!socket) {
    console.log(`Initializing socket for user: ${userId}`);
    socket = io(SOCKET_SERVER_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call initSocket first.");
  }
  return socket;
};

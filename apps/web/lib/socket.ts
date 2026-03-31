import { io, Socket } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

let socket: Socket | undefined;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: true,
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to Nexus Real-Time Events', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Real-Time Events');
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
};

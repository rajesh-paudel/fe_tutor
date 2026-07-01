import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: { userId: userId || token },
      transports: ["websocket"],
      withCredentials: true,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

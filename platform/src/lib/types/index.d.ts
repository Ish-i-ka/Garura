import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

// This is the custom NextApiResponse type that includes our Socket.IO server instance.
// By defining it here, we can import it into any file that needs it without
// having to rewrite the type definition every time.
export type NextApiResponseServerIo = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
// NEXT.JS SERVER: src/pages/api/socket.ts

import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { initializeSocketIO } from '@/sockets';
import { NextApiResponseServerIo } from '@/lib/types'; // We'll create this type file

export const config = { api: { bodyParser: false } };

export default function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (!res.socket.server.io) {
    console.log('🔌 Initializing new Socket.IO server...');
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      // --- THE FIX ---
      // 1. Explicitly allow all origins for Vercel's dynamic environment
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;
    initializeSocketIO(io);
  }
  res.end();
}
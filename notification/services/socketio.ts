import { Server, Socket } from 'socket.io';
import { Notification } from '../modals/Notification';

const CORS = {
     origin: '*',
     methods: ['GET', 'POST'],
};

class SocketIO {
     public static serverInstance: SocketIO;
     public io: Server;

     constructor(server: any) {
          SocketIO.serverInstance = this;
          this.io = new Server(server, {
               // serveClient: false,
               // pingInterval: 10000,
               // pingTimeout: 5000,
               // cookie: false,
               cors: CORS,
          });
          console.log('Socket io created');

          this.io.on('connect', this.startListeners);
          console.log('Socket IO has started');
     }

     public static getInstance() {
          console.log('server instance', SocketIO.serverInstance);
          if (SocketIO.serverInstance) {
               return SocketIO.serverInstance;
          }
     }

     connected = async (user_id: number) => {
          return await Notification.findOneHavingSocketID(user_id);
     };

     startListeners = (socket: Socket) => {
          socket.on('connect_failed', function () {
               console.info(`Sorry ....`);
          });

          socket.on('handshake', async (callback: (user_id: number, socketId: string) => void) => {
               const id = (socket.handshake.query as any).user_id;

               const notification = await Notification.findAndUpdate({ user_id: parseInt(id), socket_id: socket.id });

               if (notification) {
                    const { user_id, socket_id } = notification;
                    callback(user_id, socket_id);
               }
          });
          socket.on('disconnect', async () => {
               console.log('diconnected');
               await Notification.findAndUpdate({ user_id: (socket.handshake.query as any).user_id, socket_id: '' });
          });

          socket.on('close', async () => {
               //remove socket_id
               console.log('it runs');
               await Notification.findAndUpdate({ user_id: (socket.handshake.query as any).user_id, socket_id: '' });
          });
     };

     async send(notification: any, user_id: number) {
          const socket_id = await this.connected(user_id);
          if (socket_id) {
               this.io.to(socket_id).emit('pull-notification', notification);
          }
     }
}
export default SocketIO;

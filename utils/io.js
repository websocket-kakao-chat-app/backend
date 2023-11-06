const chatController = require('../Controllers/chat.controller');
const userController = require('../Controllers/user.controller');
const roomController = require('../Controllers/room.controller');

module.exports = function (io) {
  // io 관련된 모든 일
  io.on('connection', async (Socket) => {
    console.log('client connection', Socket.id);

    Socket.emit('rooms', await roomController.getAllRooms());

    // 1. 유저정보
    Socket.on('login', async (userName, cb) => {
      // 유저 정보를 저장
      try {
        const user = await userController.saveUser(userName, Socket.id);
        // const welcome = {
        //   chat: `${user.name}is joined to this room`,
        //   user: { id: null, name: 'system' },
        // };
        // io.emit('message', welcome);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, data: error.message });
      }
    });

    Socket.on('sendMessage', async (message, cb) => {
      try {
        // socket id로 유저를 찾고
        const user = await userController.checkUser(Socket.id);
        // 메세지 저장(유저)
        const newMessage = await chatController.saveChat(message, user);
        io.to(user.room.toString()).emit('message', newMessage);
        return cb({ ok: true });
      } catch (error) {
        cb({ ok: false, data: error.message });
      }
    });

    Socket.on('joinRoom', async (rid, cb) => {
      try {
        const user = await userController.checkUser(Socket.id);
        await roomController.joinRoom(rid, user);
        Socket.join(user.room.toString());
        const welcomeMessage = {
          chat: `${user.name} is joined to this room`,
          user: { id: null, name: 'system' },
        };
        io.to(user.room.toString()).emit('message', welcomeMessage);
        io.emit('rooms', await roomController.getAllRooms());
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    Socket.on('leaveRoom', async (_, cb) => {
      try {
        const user = await userController.checkUser(Socket.id);
        await roomController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.name} left this room`,
          user: { id: null, name: 'system' },
        };
        Socket.broadcast.to(user.room.toString()).emit('message', leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다
        io.emit('rooms', await roomController.getAllRooms());
        Socket.leave(user.room.toString()); // join했던 방을 떠남
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
      }
    });

    Socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

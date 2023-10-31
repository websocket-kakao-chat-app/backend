const chatController = require('../Controllers/chat.controller');
const userController = require('../Controllers/user.controller');
module.exports = function (io) {
  // io 관련된 모든 일
  io.on('connection', async (Socket) => {
    console.log('client connection', Socket.id);

    //1. 유저정보
    Socket.on('login', async (userName, cb) => {
      // 유저 정보를 저장
      console.log(`${userName}님이 채팅방에 입장하셨습니다.`);
      try {
        const user = await userController.saveUser(userName, Socket.id);
        const welcome = {
          chat: `${user.name}is joined to this room`,
          user: { id: null, name: 'system' },
        };
        io.emit('message', welcome);
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
        io.emit('message', newMessage);
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, data: error.message });
      }
    });

    Socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

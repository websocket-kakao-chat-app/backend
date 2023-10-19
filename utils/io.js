const userController = require('../Controllers/user.controller');
module.exports = function (io) {
  //io 관련된 모든 일
  io.on('connection', async (Socket) => {
    console.log('client connection', Socket.id);

    Socket.on('login', async (userName, cb) => {
      //유저 정보를 저장
      console.log(`${userName}님이 채팅방에 입장하셨습니다.`);
      try {
        const user = await userController.saveUser(userName, Socket.id);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, data: error.message });
      }
    });

    Socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

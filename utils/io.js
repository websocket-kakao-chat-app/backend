module.exports = function (io) {
  //io 관련된 모든 일
  io.on('connection', async (Socket) => {
    console.log('client connection', Socket.id);

    Socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

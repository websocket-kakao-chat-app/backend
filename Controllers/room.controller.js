const Room = require('../Models/room');

const roomController = {};

roomController.getAllRooms = async () => {
  const roomList = await Room.find({});
  return roomList;
};

//채팅방을 클릭하면 그 채팅방에 join 한다.
//1. room-members 필드 리스트에 해당 유저 추가
roomController.joinRoom = async (roomId, user) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error('해당 방이 없습니다.');
  }
  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }
  user.room = roomId;
  await user.save();
};

roomController.leaveRoom = async (user) => {
  const room = await Room.findById(user.room);
  if (!room) {
    throw new Error('Room not found');
  }
  room.members.remove(user._id);
  await room.save();
};

module.exports = roomController;

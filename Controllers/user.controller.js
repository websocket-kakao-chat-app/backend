const userController = {};
const User = require('../Models/user');

userController.saveUser = async (userName, sid) => {
  //이미 있는 유저인지 확인
  //없다면 새로 유저 정보를 만들기, 있는 유저라면 연결 정보만 token값만 바꿔준다
  let user = await User.findOne({ name: userName });
  if (!user) {
    user = new User({
      name: userName,
      token: sid, //token값은 나의 현재 연결상태
      online: true,
    });
  }
  user.token = sid;
  user.online = true;

  await user.save();
  return user;
};
module.exports = userController;

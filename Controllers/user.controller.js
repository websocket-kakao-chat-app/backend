const userController = {};
const User = require('../Models/user');

userController.saveUser = async (userName, sid) => {
  //이미 있는 유저인지 확인
  //없다면 새로 유저 정보를 만들기, 있는 유저라면 연결 정보만 token값만 바꿔준다
  let user = await User.findOne({ name: userName });
  if (user) {
    throw new Error('이미 존재하는 닉네임 입니다.');
  } else {
    user = new User({
      name: userName,
      token: sid, //token값은 나의 현재 연결상태
      online: true,
    });
  }

  await user.save();
  console.log(user);
  return user;
};

userController.checkUser = async (sid) => {
  const user = await User.findOne({ token: sid });
  if (!user) throw new Error('user not found');
  return user;
};

module.exports = userController;

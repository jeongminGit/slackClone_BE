const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect(process.env.MONGO_URL, {
    dbName: 'SlackClone',
  }, (error) => {
    if (error) {
      console.log('몽고디비 연결 에러', error);
    } else {
      console.log('몽고디비 연결 성공');
    }
  });
};

module.exports = connect;

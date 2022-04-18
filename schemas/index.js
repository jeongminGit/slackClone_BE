const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URL = `mongodb+srv://SlackClone:slack2022@cluster0.ij7rk.mongodb.net/Cluster0?retryWrites=true&w=majority`
// const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;
console.log(MONGO_URL);

const connect = () => {
  if (NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
  mongoose.connect(MONGO_URL, {
    dbName: 'gifchat',
    // useNewUrlParser: true,
    // useCreateIndex: true,
  }, (error) => {
    if (error) {
      console.log('몽고디비 연결 에러', error);
    } else {
      console.log('몽고디비 연결 성공');
    }
  });
};

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
// mongoose.connection.on('disconnected', () => {
//   console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
//   connect();
// });

module.exports = connect;


// 작업한 것
// const mongoose = require ("mongoose");

// const connect = () => {
//     mongoose
//       .connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//       })
//       .catch(err => console.log(err));
//   };

//   mongoose.connection.on("error", err => {
//     console.error("몽고디비 연결 에러", err);
//   });

//   // mongoose.connection.on("disconnected", err => {
//   //   console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
//   //   connect();
//   // });

// module.exports = connect;
  
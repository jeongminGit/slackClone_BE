const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/mydb', {});
// var db = mongoose
// .connect("mongodb+srv://test:test@cluster0.9zxeb.mongodb.net/cluster0?retryWrites=true&w=majority",{
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
//         ignoreUndefined: true
//     })
//     .then(() => console.log('MongoDB 연결완료'))
//     .catch(err =>{console.log(err);
// });




const MONGO_URL = `mongodb+srv://SlackClone:slack2022@cluster0.ij7rk.mongodb.net/Cluster0?retryWrites=true&w=majority`


const connect = () => {
    //   mongoose.connect('mongodb://localhost/mydb', {});
    // var db = mongoose
    // .connect("mongodb+srv://SlackClone:slack2022@cluster0.ij7rk.mongodb.net/Cluster0?retryWrites=true&w=majority",{
    //         // useNewUrlParser: true,
    //         // useUnifiedTopology: true,
    //         // // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
    //         // ignoreUndefined: true
    //     })
    //     .then(() => console.log('MongoDB 연결완료'))
    //     .catch(err =>{console.log(err);
    // });



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

// mongoose.connection.on('error', (error) => {
//   console.error('몽고디비 연결 에러', error);
// });
// mongoose.connection.on('disconnected', () => {
//   console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
//   connect();
// });

module.exports = connect;

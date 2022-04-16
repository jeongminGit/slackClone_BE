const mongoose = require ("mongoose");

const connect = () => {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .catch(err => console.log(err));
  };

  mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
  });

  mongoose.connection.on("disconnected", err => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect();
  });

// const dbConnection = mongoose.connection;
// dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
// dbConnection.once("open", () => console.log("Connected to DB!"));

module.exports = connect;
  
const mongoose = require ("mongoose");

const connect = () => {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch(err => console.log(err));
  };

  mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
  });


// const dbConnection = mongoose.connection;
// dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
// dbConnection.once("open", () => console.log("Connected to DB!"));

module.exports = connect;
  
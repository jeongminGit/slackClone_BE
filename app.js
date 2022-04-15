const express = require("express");
// const connect = require("./schemas");
const cors = require("cors");
const app = express();
const port = 3000;


// connect();

// const channelRouter = require("./routes/channel");


app.use(cors());
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/api", [channelRouter]);

app.listen(port, () => {
  console.log(port, "포트가 켜졌습니다.");
});
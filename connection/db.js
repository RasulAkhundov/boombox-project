const mongoose = require("mongoose");

const URI =
  "mongodb+srv://raxundov:20022005rt@boombox-news.lyzzm.mongodb.net/<dbname>?retryWrites=true&w=majority";
const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
  } catch (err) {
    console.log("error logs from atlass", err);
  }
  console.log("connected mongo db atlas");
};
module.exports = connectDB;
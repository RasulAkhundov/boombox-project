const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');
const http = require("http").createServer(app);
const io = require("socket.io")(http);

//routers
const authRouter = require("./routes/auth");
const allNews = require("./routes/all-news");

//ejs
app.set("view engine", "ejs");
//public
app.use(require("express").static("public"));
//body parser
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
//cors
app.use(cors());

//express session
app.use(
    session({ 
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    })
);

//flash
app.use(flash());

//global vars


//router init
app.use("/api", authRouter);
app.use("/api", allNews);

//all
app.get("/", (req, res) => {
    res.render("dashboard");
});

//register
app.get("/register", (req, res) => {
    res.render("register");
});

//login
app.get("/login", (req, res) => {
    res.render("login");
});

//admin panel
app.get("/admin-panel", (req, res) => {
    res.render("admin-panel");
});

//techno news
app.get("/technology", (req, res) => {
    res.render("techno-news");
});

//game news
app.get("/game", (req, res) => {
    res.render("game-news");
});

//trend news
app.get("/trend", (req, res) => {
    res.render("trend-news");
});

//settings
app.get("/settings", (req, res) => {
    res.render("settings");
});

//News Link
app.get("/news/:id", (req, res) => {
    res.render('full-news')
});

app.get("/category-:hashtag1", (req, res) => {
    res.render("mostFunctions");
});

app.get("/*", (req, res) => {
    res.send('error 404 not found');
});

// mongoose connect
mongoose.set("useCreateIndex", true);
mongoose.connect(
  "mongodb://localhost/boombox",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => console.log("mongodb is ready")
);

// socket io connect
io.on("connection", socket => {
    console.log(socket.id);
    socket.on("message", data => {
      io.emit("message", data);
    });
});

http.listen(4000, () => {
    console.log("ready at 4000");
})
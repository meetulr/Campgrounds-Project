const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
mongoose.set('strictQuery', true);


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());


async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
        console.log("mongo connection open");
    } catch (err) {
        console.log("mongo connection error ", err);
    }
}

main();


app.get("/", (req, res) => {
    res.render("home");
})

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/campgrounds", campgrounds);

app.use("/campgrounds/:id/reviews", reviews);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) { err.message = "something went wrong"; }
    res.status(statusCode).render("error", { err });
})

app.listen(3000, (req, res) => {
    console.log("serving on port 3000");
})
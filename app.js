const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require(path.join(__dirname,"models/campground"));
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
mongoose.set('strictQuery', false);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
        console.log("mongo connection open");
    } catch (err) {
        console.log("mongo connection error ", err);
    }
}

main();

app.get("/", (req,res) => {
    res.render("home");
})

app.get("/campgrounds", async (req,res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", {campgrounds});
})

app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new");
})

app.post("/campgrounds", async (req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get("/campgrounds/:id", async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", {campground});
})

app.get("/campgrounds/:id/edit", async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {campground});   
})

app.put("/campgrounds/:id", async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new:true});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete("/campgrounds/:id", async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})

app.listen(3000, (req,res) => {
    console.log("serving on port 3000");
})
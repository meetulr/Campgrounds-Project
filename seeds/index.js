const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places,descriptors} = require("./seedHelpers");

mongoose.set('strictQuery', false);

async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
        console.log("mongo connection open");
    } catch (err) {
        console.log("mongo connection error ", err);
    }
}

main();

const sample = arr => arr[Math.floor(Math.random()*arr.length)];

const seedDB = async () => {
    await Campground.deleteMany();
    for(let i=0; i<50; ++i){
        const rand1000 = Math.floor(Math.random()*1000);

        const camp = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
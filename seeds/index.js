const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

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

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany();
    for (let i = 0; i < 50; ++i) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;

        const camp = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus doloribus amet porro molestiae in ipsam, a beatae odio nesciunt illo dolore perspiciatis. Enim reprehenderit voluptatem in magni soluta voluptate quibusdam.",
            price
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
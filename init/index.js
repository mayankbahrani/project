const mongoose = require("mongoose");
const initData = require("../init/data");
const Listing = require("../models/listing");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    
}

main()
.then((res) => {
    console.log("connection established");
})
.catch((err) => {
    console.lof("cannot connect");
});

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner: "67da95629c4613abc8388f85"} ));
    await Listing.insertMany(initData.data);
    console.log("data is initialized");
};

initDb();



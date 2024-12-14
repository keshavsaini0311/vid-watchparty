import mongoose from "mongoose";

const url=process.env.url;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
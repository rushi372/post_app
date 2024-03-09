import mongoose from "mongoose";
//Connecting to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected successfully with mongodb ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
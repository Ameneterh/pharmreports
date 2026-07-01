import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error.message);
    process.exit(1); //shows failure
  }
};

export default dbConnection;

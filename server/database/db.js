import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(process.env.URL, { useNewUrlParser: true });
    console.log("Database connected successfully");
    console.log();
  } catch (error) {
    console.log("Error while connecting to the database ", error);
  }
};

export default Connection;

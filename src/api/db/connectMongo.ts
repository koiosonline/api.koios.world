import mongoose from "mongoose";

export const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    mongoose.connections[0];
    return;
  } else {
    if (process.env.NODE_ENV === "test") {
      mongoose.connect(process.env.MONGO_URI_TEST);
      console.log("ENV == " + process.env.NODE_ENV);
    } else {
      mongoose.connect(process.env.MONGO_URI_DEV);
    }
  }
};

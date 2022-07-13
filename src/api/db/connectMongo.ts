import mongoose from "mongoose";

export const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    mongoose.connections[0];
    return;
  }
  mongoose.connect(process.env.MONGO_URI);
};

import mongoose from "mongoose";

export const connectMongo = async () => {
  if (process.env.NODE_ENV === "test") {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGO_URI_TEST);
    }
  } else {
    mongoose.connect(process.env.MONGO_URI_DEV);
  }
  return mongoose;
};

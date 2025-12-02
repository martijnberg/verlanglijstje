// backend/config/db.js
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/verlanglijstje";

    if (!uri) {
      throw new Error("Geen Mongo-URI gezet in MONGO_URI / MONGODB_URI");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

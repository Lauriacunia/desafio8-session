import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
});

export { usersSchema };

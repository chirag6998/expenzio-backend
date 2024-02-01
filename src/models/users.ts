import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    tags: { type: [{ frequency: String, name: String }] }
})

const User = mongoose.model("User", userSchema);

export default User;
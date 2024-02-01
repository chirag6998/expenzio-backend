import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    month: { type: Number },
    amount: { type: Number },
    userId: { type: String },
    year: { type: String }
})

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema({
    tag: { type: String },
    amount: { type: Number },
    date: { type: String },
    userId: { type: mongoose.Types.ObjectId },
})

const Expenses = mongoose.model("Expenses", expensesSchema);

export default Expenses;
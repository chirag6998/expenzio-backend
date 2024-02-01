import express from "express";
import createUser from "../controllers/createUser";
import saveBudget from "../controllers/saveBudget";
import validateToken from "../middlewares/validateToken";
import signIn from "../controllers/signIn";
import findBudget from "../controllers/findBudget";
import addTags from "../controllers/addTags";
import fetchPendingTags from "../controllers/fetchPendingTags";
import createUpdateExpense from "../controllers/createUpdateExpense";
import fetchExpenses from "../controllers/fetchExpenses";
const router = express.Router();

//Routes
router.post("/users", createUser);
router.post("/signin", signIn);
router.post("/budget", validateToken, saveBudget);
router.get("/budget", validateToken, findBudget);
router.post("/tags", validateToken, addTags);
router.get("/pending/tags", validateToken, fetchPendingTags);
router.post("/expense/:expenseId", validateToken, createUpdateExpense);
router.post("/expense", validateToken, createUpdateExpense);
router.get("/expenses", validateToken, fetchExpenses);

export default router;
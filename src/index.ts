require("dotenv").config();
require("./db/mongoose");
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes";

const PORT = process.env.PORT || "";

const app = express();

app.use(cors());

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method}, ${req.url}`);
    next();
})

app.use('/api', router);

app.listen(parseInt(PORT), () => {
    console.log(`Server running on port: ${PORT}`);
})
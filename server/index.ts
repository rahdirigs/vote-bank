import dotenv from "dotenv";
import express from "express";
import connectDb from "./config/database";
import { errorHandler, notFound } from "./middleware/error.middleware";
import electionRoutes from "./routes/election.routes";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());

dotenv.config();
connectDb();

app.get("/", (req, res) => {
  res.send("The api is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/elections", electionRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "production";

app.listen(PORT, () => {
  console.log(`Server listening in ${NODE_ENV} mode on port number ${PORT}`);
});

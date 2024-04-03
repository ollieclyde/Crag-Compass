import express from "express";
import cors from "cors";
import router from "./router";
import helmet from "helmet";
import "dotenv/config";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(router);
app.get("*", (req, res) => {
  res.status(404).send("Sorry, not found 😞");
});

async function run() {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}/`);
  });
}

run();

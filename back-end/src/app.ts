import express, { Application } from "express";
import cors from "cors";
import { config } from "./config";
import { apiRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Simple Blog API",
    endpoints: {
      posts: "GET /api/posts",
    },
  });
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export { app };

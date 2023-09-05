import express from "express";
import routes from "./config/routes.js";
import migration from "./config/migration.js";

const app  = express();
const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || 'localhost';

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message    = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    message: err.message,
  });
});

const run  = async () => {
  await migration();
  
  app.listen(PORT);
  
  console.log(`Server run on http://${HOST}:${PORT}/`);
};

run();
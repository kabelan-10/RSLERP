import express from "express";
import cors from "cors";
import Uomrouter from "./Routes/UOMrouter.js"; // Adjust import path for router
import Upload from "./Routes/Upload.js";
import itemsRouter from "./Routes/ItemsRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

// Use your router for routes related to UOM
app.use('/api/uom', Uomrouter);
app.use('/api/upload', Upload);
app.use('/api/items' , itemsRouter)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
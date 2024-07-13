import express from "express";
import productRoutes from "./routes/ProductRoutes.js"; // Adjust the path as necessary
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use('/images', express.static('public/images')); // Serve images statically
app.use('/api', productRoutes); // Use the routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
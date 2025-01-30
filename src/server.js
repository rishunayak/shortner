import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import connectToMongoDb  from "./config/db.js";




const swaggerDocument=JSON.parse(fs.readFileSync(path.resolve('./swagger.json'),'utf-8'));

dotenv.config()

const app=express();
app.use(express.json());

 






app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
)

app.use(cors())

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/shorten", urlRoutes);



(async () => {

    app.listen(5001, async() => {
       await connectToMongoDb()
       console.log(
            `Swagger-ui is available on http://localhost:5001/api-docs`,
        );
    });
})();

export default app
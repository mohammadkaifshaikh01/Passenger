import express from "express";
import dotenv from "dotenv"
import connectDB from "./src/config/MongoDb.js";
import cors from "cors"
import passengerRouter from "./src/routes/passenger.routes.js";


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/passenger',passengerRouter)
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
   return res.send("Welcome to Kaif Project")
})


app.listen(PORT,(req,res)=>{
   console.log("Server Is Running")
   connectDB()
})
app.use("/api", passengerRouter);
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import upload_image from "./upload_image.js";

const app = express();
const port = process.env.PORT || 5000

dotenv.config();

app.use(express.json())
app.use(cors());



//DB connection
mongoose.connect(process.env.CONNECTION_STRING , {useCreateIndex:true,useUnifiedTopology:true , useNewUrlParser:true })
mongoose.connection.once("open" , ()=>{
    console.log("connection to database has been established successfully")
})


app.get('/', (req,res)=>{
    console.log("server is running ")

})



app.use("/uploadImage" , upload_image )

app.listen(port , ()=>{
    console.log("server is running on port: "+ port)
})

export default app;

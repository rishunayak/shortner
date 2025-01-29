import mongoose from "mongoose";


const connectToMongoDb=async()=>
{
    try {

        await mongoose.connect(process.env.MongoDB)
        console.log("connected to mongoDB")
         
    } catch (error) {
      
        console.log("error connecting mongoDb",error)   
    }
}

export default connectToMongoDb
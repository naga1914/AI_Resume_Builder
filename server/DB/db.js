import mongoose from "mongoose";

const connectDB =async()=>{
    try{
       mongoose.connection.on("connected", ()=>{console.log("Database connected successfully")})

       let mongodbURL=process.env.MONGODB_URL;
       const projectName= 'resume-builder';

       if(!mongodbURL){
        throw new Error("MONGODB_URL env var not set")
       }
       if(mongodbURL.endsWith('/')){
        mongodbURL=mongodbURL.slice(0,-1)
       }

       await mongoose.connect(`${mongodbURL}/${projectName}`)

    }
    catch(error){
        console.log("Error connecting to database:",error);
    }
}

export default connectDB;
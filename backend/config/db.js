import mongoose from "mongoose";

const connectdb=async () => {
    try{
        //  console.log("MONGODB_URL:", process.env.MONGODB_URL)
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connected");
    }catch(e){
        console.error(e);
    }
}

export default connectdb
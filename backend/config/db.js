import mongoose from "mongoose";

const connectdb=async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connected");
    }catch(e){
        console.error(e);
    }
}

export default connectdb
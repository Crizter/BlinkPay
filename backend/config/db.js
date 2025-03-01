
import mongoose from 'mongoose' ; 
import dotenv from 'dotenv' ; 
dotenv.config();
import User from '../models/user.models.js' ; 
import Vendor from '../models/vendor.models.js' ; 
import EyeData from '../models/eyeDataSchema.models.js' ;   
import Transaction from '../models/transaction.models.js' ; 

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process on failure
  }
};

// module.exports = connectDB;
export default connectDB;
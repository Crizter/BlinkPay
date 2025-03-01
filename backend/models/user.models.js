import mongoose from 'mongoose' ; 

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  upiId: { type: String, required: true }, // e.g., user@upi
  bankAccount: { type: String, required: true }, // Optional for direct bank linking
  eyeScanData: { type: mongoose.Schema.Types.ObjectId, ref: "EyeData" }, // Linked to eye scan model
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User",userSchema) ; 




import mongoose from 'mongoose' ; 

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    paymentMethod: { type: String, enum: ["UPI", "Bank Transfer"], required: true },
    transactionId: { type: String, unique: true, required: true }, // Unique transaction reference
    createdAt: { type: Date, default: Date.now }
  });
  
export default mongoose.model("Transaction", transactionSchema);


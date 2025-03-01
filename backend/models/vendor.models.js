import mongoose from 'mongoose' ; 

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    businessName: { type: String, required: true },
    upiId: { type: String, required: true }, // Vendor's UPI for receiving payments
    bankAccount: { type: String, required: true }, // Optional direct deposit
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }], // Linked transactions
    createdAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.model("Vendor",vendorSchema) ; 



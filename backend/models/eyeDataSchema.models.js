import mongoose from 'mongoose' ; 

const eyeDataSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    irisHash: { type: String, required: true }, // Encrypted iris scan data
    customEyeMovementPattern: { type: String, required: true }, // Unique eye movement sequence
    createdAt: { type: Date, default: Date.now }
  });
  

  export default mongoose.model("EyeData", eyeDataSchema);



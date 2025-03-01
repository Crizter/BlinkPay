import mongoose from "mongoose";

const IrisSchema = new mongoose.Schema({
  leftIris: [{ x: Number, y: Number }],
  rightIris: [{ x: Number, y: Number }],
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  irisData: { type: IrisSchema, required: true },
  upiId: { type: String, required: true },
  balance: { type: Number, default: 1000 },
});

export default mongoose.model("User", UserSchema);

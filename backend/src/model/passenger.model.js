import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  photo: { type: String, required: true },
  idcard: { type: String, required: true },
});

const passengerModel = mongoose.model("passenger", passengerSchema);
export default passengerModel;

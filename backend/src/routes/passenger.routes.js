import express from "express";
import passengerModel from "../model/passenger.model.js";
import uploadOnCloudinary from "../utils/Cloud.js";
import { upload } from "../middleware/multer.middleware.js";

const passengerRouter = express.Router();

// POST: Upload passenger data (photo & ID card)
passengerRouter.post(
  "/passengerData",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "idcard", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("Received Body:", req.body);
      console.log("Received Files:", req.files);

      const { name, email, gender, age, contact } = req.body;

      if (!req.files || !req.files.photo || !req.files.idcard) {
        return res.status(400).json({ message: "Photo and ID Card (PDF) are required" });
      }

      const photoPath = req.files.photo[0].path;
      const idcardPath = req.files.idcard[0].path;

      const photoUploadResponse = await uploadOnCloudinary(photoPath);
      const idcardUploadResponse = await uploadOnCloudinary(idcardPath);

      const passenger = new passengerModel({
        name,
        email,
        gender,
        age,
        contact,
        photo: photoUploadResponse?.url,
        idcard: idcardUploadResponse?.url
      });

      const result = await passenger.save();
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error in /passengerData", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// GET: Fetch all passengers
passengerRouter.get("/passengerData", async (req, res) => {
  try {
    const passengers = await passengerModel.find();
    return res.status(200).json(passengers);
  } catch (error) {
    console.error("Error fetching passengers:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// GET: Fetch a single passenger by ID
passengerRouter.get("/passengerData/:id", async (req, res) => {
  try {
    const passenger = await passengerModel.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }
    return res.status(200).json(passenger);
  } catch (error) {
    console.error("Error fetching passenger by ID:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// DELETE: Delete a passenger by ID   
passengerRouter.delete("/passengerData/:id", async (req, res) => {
  try {
    const passenger = await passengerModel.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }
    await passengerModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Passenger deleted successfully" });
  } catch (error) {
    console.error("Error deleting passenger by ID:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default passengerRouter;

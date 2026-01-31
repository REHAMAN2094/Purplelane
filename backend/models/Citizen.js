const mongoose = require("mongoose");

const CitizenSchema = new mongoose.Schema({
  name: String,
  gender: String,
  dob: Date,
  phone: String,
  email: String,
  address: {
    door_no: String,
    village: String,
    mandal: String,
    district: String,
    state: String,
    pincode: String
  },
  identity: {
    aadhar: String,
    voter_id: String,
    pan: String
  },
  login_id: { type: mongoose.Schema.Types.ObjectId, ref: "Login" }
}, { timestamps: true });

module.exports = mongoose.model("Citizen", CitizenSchema);


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: { type: String, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order" }
}, {
  timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
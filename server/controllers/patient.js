const Patient = require('../models/patient');
const Order = require('../models/order');

const template = (body) => {
    if (!body) return body;
    let result = {
        Id: body._id,
        Name: body.name,
        OrderId: body.orderId ? body.orderId : null
    };
    return result;
}

const getPatients = async (req, res) => { 
    try {
        const patients = await Patient.find().populate("orderId");
        res.status(200).json(patients.map(i => template(i)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPatient = async (req, res) => { 
    const { id } = req.params;

    try {
        const patient = await Patient.findById(id).populate("orderId");
        if (patient == null) return res.status(404).json({ message: 'Patient not exist' });
        res.status(200).json(template(patient));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createPatient = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send({ message: `Name is required: ${name}` });

    const patient = new Patient({ name })

    try {
        await patient.save();
        res.status(201).json(template(patient));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).send({ message: `Name is required: ${name}` });

    try {
        const patient = await Patient.findByIdAndUpdate(id, { name }, { new: true });
        if (patient == null) return res.status(404).json({ message: 'Patient not exist' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deletePatient = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findById(id);
        if (patient && patient.orderId) await Order.findByIdAndRemove(patient.orderId);
        await Patient.findByIdAndRemove(id);
        res.status(200).json({ message: "Patient deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getPatient,
    getPatients,
    createPatient,
    updatePatient,
    deletePatient
};
const Patient = require('../models/patient');
const Order = require('../models/order.js');

const template = (body) => {
    if (!body) return body;
    let result = {
        Id: body._id,
        Message: body.message,
    };
    return result;
}

const getOrders = async (req, res) => { 
    try {
        const orders = await Order.find();
        res.status(200).json(orders.map(i => template(i)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrder = async (req, res) => { 
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (order == null) return res.status(404).json({ message: 'Order not exist' });
        res.status(200).json(template(order));
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createOrder = async (req, res) => {
    const patientId = req.params.id;
    const { message } = req.body;
    if (!message) return res.status(400).send({ message: `Message is required: ${message}` });

    const order = new Order({ message, patientId });

    try {
        const patient = await Patient.findById(patientId);
        if(!patient) return res.status(404).send(`No patient with id: ${patientId}`);
        await Patient.findByIdAndUpdate(patient, { orderId: order._id });
        await order.save();
        res.status(201).json(template(order));
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).send({ message: `Message is required: ${id}` });

    try {
        const order = await Order.findByIdAndUpdate(id, { message }, { new: true });
        res.status(200).json(template(order));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        await Order.findByIdAndRemove(id);
        let patient = await Patient.findOne({ orderId: id });
        if (patient) {
            patient.orderId = undefined;
            await patient.save();
        }  
        res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { 
    getOrders,
    getOrder, 
    createOrder, 
    updateOrder, 
    deleteOrder 
}
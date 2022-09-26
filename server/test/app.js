const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { assert } = require('chai');

const patientModel = require('../models/patient');
const orderModel = require('../models/order');

const patientData = { name: "test" }
const orderData = { message: "test" }
const fakePatientId = "63315c5ecc039e6c610ee7f5";
const fakeOrderId = "63315c5ecc039e6c610ee7f5";

let mongoServer;
let app;

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.ATLAS_URI=mongoUri;
    app = require('../index.js');
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST / patients', () => {
    it('returns a 400 if param missing', async () => {
        await request(app)
            .post('/api/patients')
            .send({
                test: "test"
            })
            .expect(400);
    });

    it('creates a patient with valid inputs', async () => {
        let patients = await patientModel.find();
        assert.equal(patients.length, 0);

        await request(app)
            .post('/api/patients')
            .send(patientData)
            .expect(201);

        patients = await patientModel.find();
        assert.equal(patients.length, 1);
        assert.equal(patients[0].Name, patientData.Name);
    });
});

describe('GET / patients', () => {
    it('returns a 404 if the patient is not found', async () => {   
        await request(app)
            .get(`/api/patients/${fakePatientId}`)
            .send()
            .expect(404);
    });
    
    it('returns the patient if the patient id is found', async () => {
        const addPatient = await request(app)
            .post('/api/patients')
            .send(patientData)
            .expect(201);

        const response = await request(app)
            .get(`/api/patients/${addPatient.body.Id}`)
            .send()
            .expect(200);

        assert.equal(response.body.Name, patientData.name);
    });

    it('returns patients', async () => {   
        const addPatient = await request(app)
            .get('/api/patients/')
            .send()
            .expect(200);

        assert.notEqual(addPatient.length, 0);
    });
});

describe('PUT / patients', () => {
    it('returns a 404 if the patient is not found', async () => {   
        await request(app)
            .put(`/api/patients/${fakePatientId}`)
            .send(patientData)
            .expect(404);
    });

    it('returns a 400 if param missing', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send(patientData)
            .expect(201);

        await request(app)
            .put(`/api/patients/${addPatient.Id}`)
            .send({
                test: "test"
            })
            .expect(400);
    });

    it('updates a patient with valid inputs', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send({
                name: "pretest"
            })
            .expect(201);

        const response = await request(app)
            .put(`/api/patients/${addPatient.body.Id}`)
            .send(patientData)
            .expect(200);

        assert.equal(response.body.name, patientData.name);
    });
});

describe('DELETE / patients', () => {
    it('returns a 200 if the patient is not found', async () => {   
        await request(app)
            .delete(`/api/patients/${fakePatientId}`)
            .send()
            .expect(200);
    });
    
    it('delete the patient if the patient is found', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send(patientData)
            .expect(201);

        await request(app)
            .delete(`/api/patients/${addPatient.body.Id}`)
            .send()
            .expect(200);
    });
});

describe('POST / orders', () => {
    it('returns a 404 if patient is not found', async () => {     
        await request(app)
            .post(`/api/patients/${fakePatientId}/orders`)
            .send(orderData)
            .expect(404);
    });

    it('creates a patient with valid inputs', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send(patientData)
            .expect(201);
        
        const addOrder = await request(app)
            .post(`/api/patients/${addPatient.body.Id}/orders`)
            .send(orderData)
            .expect(201);
        
        const patient = await request(app)
            .get(`/api/patients/${addPatient.body.Id}`)
            .send()
            .expect(200);

        assert.equal(patient.body.OrderId._id, addOrder.body.Id);
    });
});

describe('GET / orders', () => {
    it('returns a 404 if the order is not found', async () => {   
        await request(app)
            .get(`/api/orders/${fakeOrderId}`)
            .send()
            .expect(404);
    });
    
    it('returns the order if the order id is found', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send(patientData)
            .expect(201);
        
        const addOrder = await request(app)
            .post(`/api/patients/${addPatient.body.Id}/orders`)
            .send(orderData)
            .expect(201);

        const orders = await request(app)
            .get(`/api/orders/${addOrder.body.Id}`)
            .send()
            .expect(200);

        const patient = await request(app)
            .get(`/api/patients/${addPatient.body.Id}`)
            .send()
            .expect(200);

        assert.equal(patient.orderId, orders.Id);
    });

    it('returns orders', async () => {   
        const orders = await request(app)
            .get('/api/orders/')
            .send()
            .expect(200);

        assert.notEqual(orders.length, 0);
    });
});

describe('PUT / orders', () => {
    it('returns a 404 if the order is not found', async () => {   
        await request(app)
            .put(`/api/order/${fakeOrderId}`)
            .send(orderData)
            .expect(404);
    });

    it('returns a 400 if param missing', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send(patientData)
            .expect(201);
        
        const addOrder = await request(app)
            .post(`/api/patients/${addPatient.body.Id}/orders`)
            .send(orderData)
            .expect(201);

        console.log(addOrder.body)

        await request(app)
            .put(`/api/orders/${addOrder.body.Id}`)
            .send({
                test: "test"
            })
            .expect(400);
    });

    it('updates a patient with valid inputs', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send(patientData)
            .expect(201);
        
        const addOrder = await request(app)
            .post(`/api/patients/${addPatient.body.Id}/orders`)
            .send(orderData)
            .expect(201);

        const updateOrder = await request(app)
            .put(`/api/orders/${addOrder.body.Id}`)
            .send({
                message: "success"
            })
            .expect(200);

        const order = await orderModel.findById(addOrder.body.Id);

        assert.equal(updateOrder.body.Message, order.message);
    });
});

describe('DELETE / orders', () => {
    it('returns a 200 if the order is not found', async () => {   
        await request(app)
            .delete(`/api/orders/${fakeOrderId}`)
            .send()
            .expect(200);
    });
    
    it('delete the order if the order is found', async () => {
        const addPatient = await request(app)
            .post('/api/patients/')
            .send(patientData)
            .expect(201);
        
        const addOrder = await request(app)
            .post(`/api/patients/${addPatient.body.Id}/orders`)
            .send(orderData)
            .expect(201);

        await request(app)
            .delete(`/api/orders/${addOrder.body.Id}`)
            .send()
            .expect(200);

        const orders = await orderModel.findById(addOrder.body.Id);
        const patients = await patientModel.findById(addPatient.body.Id);
        assert.equal(orders, null);
        assert.equal(patients.orderId, null);
    });
});
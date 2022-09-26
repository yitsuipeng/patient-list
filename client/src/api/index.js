import axios from 'axios';

const url = 'http://localhost:5000/api';

export const fetchPatients = () => axios.get(`${url}/patients`);
export const createOrder = (patientId, newOrder) => axios.post(`${url}/patients/${patientId}/orders`, newOrder);
export const updateOrder = (id, newOrder) => axios.put(`${url}/orders/${id}`, newOrder);
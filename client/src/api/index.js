import axios from 'axios';

const url = 'https://patient-list.herokuapp.com/api';

export const fetchPatients = () => axios.get(`${url}/patients`);
export const createOrder = (patientId, newOrder) => axios.post(`${url}/patients/${patientId}/orders`, newOrder);
export const updateOrder = (id, newOrder) => axios.put(`${url}/orders/${id}`, newOrder);
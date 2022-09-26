import { FETCH_PATIENT, ADD_ORDER } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getPatients = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPatients();
    dispatch({ type: FETCH_PATIENT, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.createOrder(id, post);
    dispatch({ type: ADD_ORDER, payload: data });
  } catch (error) {
    console.log(error);
  }
};


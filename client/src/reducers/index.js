import { FETCH_PATIENT, ADD_ORDER, OPEN, CLOSE } from '../constants/actionTypes';

const initialState = {
  patients: [],
  orderState: {
    openDialog: false,
    patient: {}
  }
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_PATIENT:
      return {
        ...state,
        patients: action.payload
      };

    case OPEN:
      return {
        ...state,
        orderState: {
          ...state.orderState,
          openDialog: true,
          patient: action.payload
        }
      };
    
    case CLOSE:
      return {
        ...state,
        orderState: {
          ...state.orderState,
          openDialog: false,
          patient: {}
        }
      };
    
    case ADD_ORDER:
      return {
        ...state,
      };

    default:
      return state;
  }
};
export default rootReducer;

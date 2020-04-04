//import combineReducers để gộp tất cả các reducer
import {combineReducers} from 'redux';
import newsReducer from './news';
import userReducer from './user';
import uiReducer from './ui';
import modalReducer from './modal';
import { reducer as formReducer } from 'redux-form'
const rootReducer = combineReducers({
    news : newsReducer,
    user : userReducer,
    ui : uiReducer,
    modal : modalReducer,
    //form
    form: formReducer
});

export default rootReducer;
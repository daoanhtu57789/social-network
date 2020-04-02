import * as userConstants from './../constants/user';

//lấy dữ liệu từ firebase
export const fetchCurrentUser = (data) => {
    return {
        type : userConstants.FETCH_CURRENT_USER,
        payload : {
            data    
        }
    }
};
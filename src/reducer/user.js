import * as userConstants from './../constants/user';

const initialState = {
    currentUser : null
};

const reducer = (state = initialState,action) =>{
    switch(action.type){
        //lấy dữ liệu 
        case userConstants.FETCH_CURRENT_USER :{
            const {data} = action.payload;
            return {
                ...state,
                currentUser : data
            }
        }
        
        default : {
            return {...state};
        }
    };
};

export default reducer;


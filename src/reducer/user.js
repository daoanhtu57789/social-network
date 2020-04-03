import * as userConstants from './../constants/user';

const initialState = {
    currentUser : {
        userId : '',
        email : '',
        gender : '',
        nameUser : '',
        date : '',
        linkImage : ''
    }
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


import * as newsConstants from './../constants/news';

const initialState = {
    newsList : []
};

const reducer = (state = initialState,action) =>{
    switch(action.type){
        //lấy dữ liệu 
        case newsConstants.FETCH_NEWS_SUCCESS :{
            const {data} = action.payload;
            // data.sort().reverse();
            return {
                ...state,
                newsList : data
            }
        }
        case newsConstants.FETCH_NEWS_FAILED :{
            const {err} = action.payload;
            console.log(err);
            return {
                ...state
            }
        }

        //thêm dữ liệu 
        case newsConstants.ADD_NEWS_SUCCESS :{
            const {data} = action.payload;
            return {
                ...state,
                newsList : [data].concat(state.newsList)
            }
        }
        case newsConstants.ADD_NEWS_FAILED :{
            const {err} = action.payload;
            console.log(err);
            return {
                ...state
            }
        }
        default : {
            return {...state};
        }
    };
};

export default reducer;


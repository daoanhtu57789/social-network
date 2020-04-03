import * as newsConstants from './../constants/news';

//lấy dữ liệu từ firebase
export const fetchNewsSuccess = (data) => {
    return {
        type : newsConstants.FETCH_NEWS_SUCCESS,
        payload : {
            data    
        }
    }
};

export const fetchNewsFailed = (err) => {
    return {
        type : newsConstants.FETCH_NEWS_FAILED,
        payload : {
            err
        }
    }
};

//lấy dữ liệu từ firebase
export const addNewsSuccess = (data) => {
    return {
        type : newsConstants.ADD_NEWS_SUCCESS,
        payload : {
            data    
        }
    }
};

export const addNewsFailed = (err) => {
    return {
        type : newsConstants.ADD_NEWS_FAILED,
        payload : {
            err
        }
    }
};



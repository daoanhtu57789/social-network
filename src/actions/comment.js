import * as commentConstants from './../constants/comment';

//Lấy comment
export const fetchCommentSuccess = (data) =>{
    return {
        type: commentConstants.FETCH_COMMENT_SUCCESS,
        payload:{
            data
        }
    }
}

export const fetchCommentFailed = (error) =>{
    return {
        type: commentConstants.FETCH_COMMENT_FAILED,
        payload:{
            error
        }
    }
}


//Thêm comment
export const addCommentSuccess = (data) =>{
    return {
        type: commentConstants.ADD_COMMENT_SUCCESS,
        payload:{
            data
        }
    }
}

export const addCommentFailed = (error) =>{
    return {
        type: commentConstants.ADD_COMMENT_FAILED,
        payload:{
            error
        }
    }
}
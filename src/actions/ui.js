import * as uiConstants from './../constants/ui';
export const showLoadingLogin = () =>{
    return {
        type : uiConstants.SHOW_LOADING_LOGIN
    }
};

export const hideLoadingLogin = () =>{
    return {
        type : uiConstants.HIDE_LOADING_LOGIN
    }
};


export const showLoadingSignup = () =>{
    return {
        type : uiConstants.SHOW_LOADING_SIGNUP
    }
};

export const hideLoadingSignup = () =>{
    return {
        type : uiConstants.HIDE_LOADING_SIGNUP
    }
};
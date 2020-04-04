import * as modalConstants from './../constants/modal';

export const showModal = () => {
    return {
        type : modalConstants.SHOW_MODAL
    }
}

export const hideModal = () => {
    return {
        type : modalConstants.HIDE_MODAL
    }
}

export const changeTitle = (data) => {
    return {
        type : modalConstants.CHANGE_TITLE,
        payload:{
            data
        }
    }
}

export const changeModal = (data) => {
    return {
        type : modalConstants.CHANGE_MODAL,
        payload:{
            data
        }
    }
}
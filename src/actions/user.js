import * as userConstants from "./../constants/user";

//lấy dữ liệu từ firebase
export const fetchCurrentUser = (data) => {
  return {
    type: userConstants.FETCH_CURRENT_USER,
    payload: {
      data,
    },
  };
};

export const addAvatarUserSuccess = (avatar) => {
  return {
    type: userConstants.ADD_AVATAR_USER_SUCCESS,
    payload: {
      avatar,
    },
  };
};

export const addAvatarUserFailed = (error) => {
  return {
    type: userConstants.ADD_AVATAR_USER_FAILED,
    payload: {
      error,
    },
  };
};

export const updateUserSuccess = (data) => {
  return {
    type: userConstants.UPDATE_USER_SUCCESS,
    payload: {
      data,
    },
  };
};

export const updateUserFailed = (error) => {
  return {
    type: userConstants.UPDATE_USER_FAILED,
    payload: {
      error,
    },
  };
};

export const userEditing = (data) => {
  return {
    type: userConstants.USER_EDITING,
    payload: {
      data,
    },
  };
};

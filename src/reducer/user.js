import * as userConstants from "./../constants/user";

const initialState = {
  currentUser: {
    userId: "",
    email: "",
    gender: "",
    nameUser: "",
    date: "",
    avatar: "",
    password: "",
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //lấy dữ liệu
    case userConstants.FETCH_CURRENT_USER: {
      const { data } = action.payload;
      return {
        ...state,
        currentUser: data,
      };
    }
    //Đổi Avatar
    case userConstants.ADD_AVATAR_USER_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        currentUser: data,
      };
    }

    case userConstants.ADD_AVATAR_USER_FAILED: {
      const { error } = action.payload;
      console.error(error);
      return {
        ...state,
      };
    }

    //sửa thông tin
    case userConstants.UPDATE_USER_SUCCESS: {
      const { gender, nameUser, date, password } = action.payload.data;

      return {
        ...state,
        currentUser: { ...state.currentUser, gender, nameUser, date, password },
      };
    }

    case userConstants.UPDATE_USER_FAILED: {
      const { error } = action.payload;
      console.error(error);
      return {
        ...state,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default reducer;

import * as friendConstants from "./../constants/friend";

const initialState = {
  currentFriend: {
    friendId: "",
    email: "",
    gender: "",
    nameFriend: "",
    date: "",
    avatar: "",
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //lấy dữ liệu của người bạn
    case friendConstants.FETCH_FRIEND_PROFILE_SUCCESS: {
      const { data } = action.payload;
     
      return {
        ...state,
        currentFriend: data,
      };
    }

    case friendConstants.FETCH_FRIEND_PROFILE_FAILED: {
      const { error } = action.payload;
      console.error("reducer", error);
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

import * as friendConstants from "./../constants/friend";
//fetch data của friend you click now
export const fetchFriendProfileSuccess = (data) => {
  return {
    type: friendConstants.FETCH_FRIEND_PROFILE_SUCCESS,
    payload: {
      data,
    },
  };
};

export const fetchFriendProfileFailed = (error) => {
  return {
    type: friendConstants.FETCH_FRIEND_PROFILE_FAILED,
    payload: {
      error,
    },
  };
};

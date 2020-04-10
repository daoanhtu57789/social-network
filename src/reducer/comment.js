import * as commentConstants from "./../constants/comment";

const initialState = {
  commentList: [],
};

const reducer = (state = initialState, actions) => {
  switch (actions.type) {
    //thêm comment
    case commentConstants.FETCH_COMMENT_SUCCESS: {
      const { data } = actions.payload;
      return {
        ...state,
        commentList: data,
      };
    }

    case commentConstants.FETCH_COMMENT_FAILED: {
      const { error } = actions.payload;
      console.error(error);
      return {
        ...state,
      };
    }
    //thêm comment
    case commentConstants.ADD_COMMENT_SUCCESS: {
      const { data } = actions.payload;

      return {
        ...state,
        commentList: state.commentList.concat(data),
      };
    }

    case commentConstants.ADD_COMMENT_FAILED: {
      const { error } = actions.payload;
      console.error(error);
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;

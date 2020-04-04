import * as modalConstants from "./../constants/modal";

const initialState = {
  showModal: false,
  component: null,
  title: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //hiện form
    case modalConstants.SHOW_MODAL: {
      return {
        ...state,
        showModal: true
      };
    }
    //Ẩn form
    case modalConstants.HIDE_MODAL: {
      return {
        ...state,
        showModal: false
      };
    }

    //truyền title
    case modalConstants.CHANGE_TITLE: {
      const { data } = action.payload;
      return {
        ...state,
        title: data
      };
    }
    //truyền form
    case modalConstants.CHANGE_MODAL: {
      const { data } = action.payload;
      return {
        ...state,
        component: data
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default reducer;

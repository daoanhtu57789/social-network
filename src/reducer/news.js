import * as newsConstants from "./../constants/news";

const initialState = {
  newsList: [],
  likeList: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //lấy dữ liệu
    case newsConstants.FETCH_NEWS_SUCCESS: {
      const { data } = action.payload;
      // data.sort().reverse();
      return {
        ...state,
        newsList: data,
      };
    }
    case newsConstants.FETCH_NEWS_FAILED: {
      const { err } = action.payload;
      console.log(err);
      return {
        ...state,
      };
    }

    //thêm dữ liệu
    case newsConstants.ADD_NEWS_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        newsList: [data].concat(state.newsList),
      };
    }
    case newsConstants.ADD_NEWS_FAILED: {
      const { err } = action.payload;
      console.log(err);
      return {
        ...state,
      };
    }

    //Xóa dữ liệu
    case newsConstants.DELETE_NEWS_SUCCESS: {
      const { newsId } = action.payload;
      const newsList = state.newsList.filter((news) => news.newsId !== newsId);
      const likeList = state.likeList.filter((like) => like.newsId !== newsId);
      return {
        ...state,
        newsList: newsList,
        likeList: likeList,
      };
    }
    case newsConstants.DELETE_NEWS_FAILED: {
      const { err } = action.payload;
      console.log(err);
      return {
        ...state,
      };
    }

    //Sửa dữ liệu
    case newsConstants.UPDATE_NEWS_SUCCESS: {
      const { content, newsId } = action.payload;
      const index = state.newsList.findIndex((news) => news.newsId === newsId);
      if (index !== -1) {
        state.newsList[index].content = content;
        return {
          ...state,
        };
      }

      return {
        ...state,
      };
    }
    case newsConstants.UPDATE_NEWS_FAILED: {
      const { err } = action.payload;
      console.log(err);
      return {
        ...state,
      };
    }

    //lấy dữ liệu like
    case newsConstants.FETCH_LIKE_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        likeList: data,
      };
    }
    case newsConstants.FETCH_LIKE_FAILED: {
      const { err } = action.payload;
      console.log(err);
      return {
        ...state,
      };
    }

    //like thành công
    case newsConstants.LIKE_NEWS_SUCCESS: {
      const { data } = action.payload;
      const index = state.newsList.findIndex(
        (news) => news.newsId === data.newsId
      );
      if (index !== -1) {
        state.newsList[index].likeCount += 1;
        return {
          ...state,
          likeList: [data].concat(state.likeList),
        };
      }
      return {
        ...state,
      };
    }
    case newsConstants.LIKE_NEWS_FAILED: {
      const { err } = action.payload;
      console.log(err);
      return {
        ...state,
      };
    }

    //unlike thành công
    case newsConstants.UNLIKE_NEWS_SUCCESS: {
      const { data } = action.payload;
      const index = state.newsList.findIndex(
        (news) => news.newsId === data.newsId
      );
      const likeList = state.likeList.filter(
        (like) => like.likeId !== data.likeId
      );
      if (index !== -1) {
        state.newsList[index].likeCount -= 1;
      }
      return {
        ...state,
        likeList: likeList,
      };
    }
    case newsConstants.UNLIKE_NEWS_FAILED: {
      const { err } = action.payload;
      console.log(err);
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

import * as newsConstants from "./../constants/news";

const initialState = {
  newsList: [],
  likeList: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case newsConstants.UPDATE_NEWS_SUCCESS: {
      const { content, newsId } = action.payload;
      const index = state.newsList.findIndex((news) => news.newsId === newsId);

      if (index !== -1) {
        let news = {};
        state.newsList[index].content = content;
        news = state.newsList[index];
        let newsData = [
          ...state.newsList.slice(0, index),
          news,
          ...state.newsList.slice(index + 1),
        ];
        return {
          newsList: newsData,
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
    //lấy dữ liệu
    case newsConstants.FETCH_NEWS_SUCCESS: {
      const { data, email } = action.payload;
      if (!email) {
        return {
          ...state,
          newsList: data,
        };
      } else {
        const newsList = state.newsList.filter((news) => news.email === email);

        return {
          ...state,
          newsList: newsList,
        };
      }
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

    //lấy dữ liệu like
    case newsConstants.FETCH_LIKE_SUCCESS: {
      const { data, email } = action.payload;
      if (!email) {
        return {
          ...state,
          likeList: data,
        };
      } else {
        const likeList = state.likeList.filter(
          (like) => like.emailFriend === email
        );

        return {
          ...state,
          likeList: likeList,
        };
      }
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

import * as newsConstants from "./../constants/news";

//lấy dữ liệu từ firebase
export const fetchNewsSuccess = (data, email = null) => {
  return {
    type: newsConstants.FETCH_NEWS_SUCCESS,
    payload: {
      data,
      email,
    },
  };
};

export const fetchNewsFailed = (err) => {
  return {
    type: newsConstants.FETCH_NEWS_FAILED,
    payload: {
      err,
    },
  };
};

//lấy dữ liệu từ firebase
export const addNewsSuccess = (data) => {
  return {
    type: newsConstants.ADD_NEWS_SUCCESS,
    payload: {
      data,
    },
  };
};
export const addNewsFailed = (err) => {
  return {
    type: newsConstants.ADD_NEWS_FAILED,
    payload: {
      err,
    },
  };
};

//lấy dữ liệu từ firebase
export const deleteNewsSuccess = (newsId) => {
  return {
    type: newsConstants.DELETE_NEWS_SUCCESS,
    payload: {
      newsId,
    },
  };
};

export const deleteNewsFailed = (err) => {
  return {
    type: newsConstants.DELETE_NEWS_FAILED,
    payload: {
      err,
    },
  };
};

//lấy dữ liệu từ firebase
export const updateNewsSuccess = (content, newsId) => {
  return {
    type: newsConstants.UPDATE_NEWS_SUCCESS,
    payload: {
      content,
      newsId,
    },
  };
};
export const updateNewsFailed = (err) => {
  return {
    type: newsConstants.UPDATE_NEWS_FAILED,
    payload: {
      err,
    },
  };
};
//lấy dữ liệu like từ firebase
//email mặc định là null nếu không truyền gì vào
export const fetchLikeSuccess = (data,email=null) => {
  return {
    type: newsConstants.FETCH_LIKE_SUCCESS,
    payload: {
      data,
      email
    },
  };
};

export const fetchLikeFailed = (err) => {
  return {
    type: newsConstants.FETCH_LIKE_FAILED,
    payload: {
      err,
    },
  };
};

//like thành công
export const likeNewsSuccess = (data) => {
  return {
    type: newsConstants.LIKE_NEWS_SUCCESS,
    payload: {
      data,
    },
  };
};
export const likeNewsFailed = (err) => {
  return {
    type: newsConstants.LIKE_NEWS_FAILED,
    payload: {
      err,
    },
  };
};

//unlike thành công
export const unlikeNewsSuccess = (data) => {
  return {
    type: newsConstants.UNLIKE_NEWS_SUCCESS,
    payload: {
      data,
    },
  };
};
export const unlikeNewsFailed = (err) => {
  return {
    type: newsConstants.UNLIKE_NEWS_FAILED,
    payload: {
      err,
    },
  };
};

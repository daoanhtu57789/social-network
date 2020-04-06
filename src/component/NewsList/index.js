import React, { Component, Fragment } from "react";
//check dữ liệu nhận vào
import propTypes from "prop-types";
//component
import News from "./../News/index";
class NewsList extends Component {
  render() {
    const {
      newsList,
      onClickLike,
      likeList,
      onClickUnLike,
      onClickDelete,
      onClickEdit,
    } = this.props;

    return (
      <Fragment>
        {newsList.map((news, index) => {
          let color = "default";
          likeList.forEach((like) => {
            if (like.newsId === news.newsId) {
              color = "secondary";
              return 0;
            }
          });
          return (
            <News
              color={color}
              key={index}
              news={news}
              onClickLike={() => onClickLike(news)}
              onClickUnLike={() => onClickUnLike(news)}
              onClickDelete={() => onClickDelete(news)}
              onClickEdit={() => onClickEdit(news)}
            />
          );
        })}
      </Fragment>
    );
  }
}

NewsList.propTypes = {
  newsList: propTypes.array,
  onClickLike: propTypes.func,
  likeList: propTypes.array,
  onClickUnLike: propTypes.func,
  onClickDelete: propTypes.func,
  onClickEdit: propTypes.func,
};

export default NewsList;

import React, { Component, Fragment } from "react";
//check dữ liệu nhận vào
import propTypes from "prop-types";
//component
import News from "./../News/index";
class NewsList extends Component {
  render() {
    const { newsList } = this.props;

    return (
      <Fragment>
        {newsList.map((news, index) => {
          return <News key={index} news={news} />;
        })}
      </Fragment>
    );
  }
}

NewsList.propTypes = {
  newsList: propTypes.array
};

export default NewsList;

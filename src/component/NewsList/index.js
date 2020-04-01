import React, { Component, Fragment } from "react";
//check dữ liệu nhận vào
import propTypes from "prop-types";
//component
import News from "./../News/index";
import { Grid } from "@material-ui/core";
class NewsList extends Component {
  render() {
    const { newsList} = this.props;

    return (
      <Fragment>
        <Grid item md={3} xs={12}></Grid>
        <Grid item md={6} xs={12}>
            {newsList.map((news, index) => {
              return <News key={index} news={news} />;
            })}
        </Grid>
        <Grid item md={3} xs={12}></Grid>
      </Fragment>
    );
  }
}

NewsList.propTypes = {
  newsList: propTypes.array
};

export default NewsList;

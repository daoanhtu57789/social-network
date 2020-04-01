import React, { Component } from "react";
//css
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
//componet
import NewsList from "../../component/NewsList/index";
//kết nối đến store
import { connect } from "react-redux";
//kiểm tra dữ liệu nhận vào
import propTypes from "prop-types";

class NewsBoard extends Component {
  renderNewsList = () => {
    const { newsList } = this.props;
    let xhtml = null;
    if (newsList.length > 0) {
      xhtml = (
        <Grid container spacing={2} style={{ paddingTop: "10px" }}>
          <NewsList newsList={newsList} />
        </Grid>
      );
    } else {
      xhtml = (
        <Grid container spacing={2} style={{ paddingTop: "10px" }}>
          <Grid item md={3} xs={12}></Grid>
          <Grid item md={6} xs={12}>
            <h3>Chưa có tin nào trong bảng tin.</h3>
          </Grid>
          <Grid item md={3} xs={12}></Grid>
        </Grid>
      );
    }
    return xhtml;
  };

  render() {
    return <div>{this.renderNewsList()}</div>;
  }
}
//check props nhận vào
NewsBoard.propTypes = {
  classes: propTypes.object,
  newsList: propTypes.array
};

const mapStateToProps = state => {
  return {
    newsList: state.news.newsList
  };
};

export default connect(mapStateToProps, null)(withStyles(styles)(NewsBoard));

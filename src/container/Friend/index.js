import React, { Component, Fragment } from "react";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
//check props
import propTypes from "prop-types";
import {
  Grid,
  Typography,
  CardMedia,
  Avatar,
  Button,
  TextField,
} from "@material-ui/core";
import PersonAddDisabledOutlinedIcon from "@material-ui/icons/PersonAddDisabledOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import WcIcon from "@material-ui/icons/Wc";
//componet
import NewsList from "../../component/NewsList/index";
//kết nối đến store
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
//actions
import * as newsActions from "./../../actions/news";
//firebase
import fire from "./../../config/Fire";
class Friend extends Component {
  state = {
    showInformation: false,
  };
  //like
  onClickLike = (data) => {
    const { newsActionsCreators } = this.props;
    const { likeNewsSuccess, likeNewsFailed } = newsActionsCreators;
    const like = {
      newsId: data.newsId,
      email: localStorage.getItem("user"),
      emailFriend: data.email,
    };
    fire
      .firestore()
      .collection("likes")
      .add(like)
      .then((doc) => {
        //lấy dữ liệu danh sách đã like
        doc
          .get()
          .then((doc) => {
            likeNewsSuccess({ likeId: doc.id, ...like });
          })
          .catch((err) => {
            console.log(err);
          });

        fire
          .firestore()
          .collection("news")
          .doc(`/${data.newsId}`)
          .update({
            //update cái gì thì cho cái đó vào
            likeCount: data.likeCount + 1,
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        likeNewsFailed(err);
        console.log(err);
      });
  };
  //unlike
  onClickUnLike = (data) => {
    const { newsActionsCreators, likeList } = this.props;
    const { unlikeNewsSuccess, unlikeNewsFailed } = newsActionsCreators;

    likeList.forEach((like) => {
      if (like.newsId === data.newsId) {
        //thêm vào database likes
        fire
          .firestore()
          .collection("likes")
          .doc(`${like.likeId}`)
          .delete()
          .then((doc) => {
            unlikeNewsSuccess(like);

            fire
              .firestore()
              .collection("news")
              .doc(`/${data.newsId}`)
              .update({
                //update cái gì thì cho cái đó vào
                likeCount: data.likeCount - 1,
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            unlikeNewsFailed(err);
            console.log(err);
          });
      }
    });
  };
  renderNewsList = () => {
    const { newsList, likeList } = this.props;
    let xhtml = null;
    if (newsList.length > 0) {
      xhtml = (
        <NewsList
          newsList={newsList}
          likeList={likeList}
          onClickLike={this.onClickLike}
          onClickUnLike={this.onClickUnLike}
        />
      );
    } else {
      xhtml = (
        <Grid container spacing={2} style={{ paddingTop: "10px" }}>
          <Grid item md={5} xs={12}></Grid>
          <Grid item md={4} xs={12}>
            <h3>Loading...</h3>
          </Grid>
          <Grid item md={3} xs={12}></Grid>
        </Grid>
      );
    }
    return xhtml;
  };
  //hiển thị thông tin
  renderInformation = () => {
    this.setState({
      showInformation: !this.state.showInformation,
    });
  };
  render() {
    const { classes, currentFriend } = this.props;
    const { showInformation } = this.state;
    return (
      <Grid container spacing={2} style={{ paddingTop: "10px" }}>
        <Grid item md={3} xs={12}></Grid>
        <Grid item md={6} xs={12}>
          <CardMedia className={classes.image} image={currentFriend.avatar} />
          <Avatar src={currentFriend.avatar} className={classes.avatar} />
          <Typography variant="h4" className={classes.nameFriend}>
            {currentFriend.nameFriend}
          </Typography>
          {/* dòng kẻ ngang */}
          <div
            style={{
              width: "500px",
              border: "1px solid #CCCCCC",
              height: "1px",
              margin: "auto",
            }}
          ></div>
          <Grid
            container
            style={{ margin: "1em auto 0px auto", width: "500px" }}
          >
            <Grid item md={6} xs={12}>
              <Button variant="contained" color="primary">
                Nhắn Tin
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "1em" }}
              >
                <PersonAddDisabledOutlinedIcon />
              </Button>
            </Grid>
            <Grid item md={6} xs={12}>
              <Button variant="contained" style={{ margin: "0 2em 0 -2em" }}>
                Danh Sách Bạn
              </Button>
              <Button
                variant="contained"
                color={showInformation ? "primary" : "default"}
                onClick={this.renderInformation}
              >
                Thông Tin
              </Button>
            </Grid>
          </Grid>
          {showInformation ? (
            <Fragment>
              <div
                style={{
                  width: "500px",
                  border: "1px solid #CCCCCC",
                  height: "1px",
                  margin: "auto",
                }}
              ></div>
              <Grid
                container
                style={{ margin: "1em auto 0px auto", width: "500px" }}
              >
                <Grid item xs={12} md={3}>
                  <div className={classes.infor}>
                    <MailOutlineIcon fontSize="large" />
                    <strong>Email : </strong>
                  </div>
                  <div className={classes.infor}>
                    <AccountCircleOutlinedIcon fontSize="large" />
                    <strong>Tên : </strong>
                  </div>
                  <div className={classes.infor}>
                    <CakeOutlinedIcon fontSize="large" />
                    <strong>Ngày Sinh : </strong>
                  </div>
                  <div className={classes.infor}>
                    <HomeOutlinedIcon fontSize="large" />
                    <strong>Địa Chỉ : </strong>
                  </div>
                  <div className={classes.infor}>
                    <WcIcon fontSize="large"/>
                    <strong>Giới Tính : </strong>
                  </div>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    disabled
                    defaultValue={currentFriend.email}
                    variant="filled"
                    fullWidth
                  />
                  <TextField
                    disabled
                    defaultValue={currentFriend.nameFriend}
                    variant="filled"
                    fullWidth
                  />
                  <TextField
                    disabled
                    defaultValue={currentFriend.date}
                    variant="filled"
                    fullWidth
                  />
                  <TextField
                    disabled
                    defaultValue="Hà Nội"
                    variant="filled"
                    fullWidth
                  />
                  <TextField
                    disabled
                    defaultValue={currentFriend.gender}
                    variant="filled"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Fragment>
          ) : (
            <p></p>
          )}
          <div
            style={{
              width: "500px",
              border: "1px solid #CCCCCC",
              height: "1px",
              margin: "2em auto 2em auto",
            }}
          ></div>
          {this.renderNewsList()}
        </Grid>
        <Grid item md={3} xs={12}></Grid>
      </Grid>
    );
  }
}
Friend.propTypes = {
  classes: propTypes.object,
  newsList: propTypes.array,
  likeList: propTypes.array,
  newsActionsCreators: propTypes.shape({
    fetchNewsSuccess: propTypes.func, //
    fetchNewsFailed: propTypes.func, //
    likeNewsSuccess: propTypes.func, //
    likeNewsFailed: propTypes.func, //
    unlikeNewsSuccess: propTypes.func, //
    unlikeNewsFailed: propTypes.func, //
  }),
  currentFriend: propTypes.object,
};

const mapStateToProps = (state) => {
  return {
    newsList: state.news.newsList,
    likeList: state.news.likeList,
    currentFriend: state.friend.currentFriend,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    newsActionsCreators: bindActionCreators(newsActions, dispatch),
  };
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Friend);

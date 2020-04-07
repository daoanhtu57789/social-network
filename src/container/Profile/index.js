import React, { Component, Fragment } from "react";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

import propTypes from "prop-types";
//material
import WcIcon from "@material-ui/icons/Wc";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { TextField } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Grid, Button, Avatar } from "@material-ui/core";
//icon
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
//componet
import NewsList from "../../component/NewsList/index";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "./../../actions/user";
import * as newsActions from "./../../actions/news";
import * as friendActions from "./../../actions/friend";
import { compose } from "redux";
//firebase
import fire from "./../../config/Fire";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: "",
      progress: 0,
      nam: false,
      nu: false,
      checkednam: false,
      checkednu: false,
      nameUser: "",
      date: "",
      password: "",
      showPassword: false,
    };
  }
  handleChange = (event) => {
    if (event.target.name === "nam" && event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednu: false,
      });
    } else if (event.target.name === "nu" && event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednam: false,
      });
    }

    if (event.target.name === "nam" && !event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednu: true,
      });
    } else if (event.target.name === "nu" && !event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednam: true,
      });
    }
  };
  //chọn ảnh
  handleChangeFile = (event) => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState({ image });
    }
  };

  //lấy dữ liệu thay đổi
  handleChangeContent = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount() {
    fire
      .firestore()
      .collection("user")
      .where("email", "==", localStorage.getItem("user"))
      .get()
      .then((data) => {
        data.forEach((doc) => {
          this.setState({
            nam: doc.data().gender === "nam" ? true : false,
            nu: doc.data().gender === "nu" ? true : false,
            checkednam: doc.data().gender === "nam" ? true : false,
            checkednu: doc.data().gender === "nu" ? true : false,
          });
        });
      });
    const { friendActionsCreators, newsActionsCreators, newsList } = this.props;
    const {
      fetchFriendProfileSuccess,
      fetchFriendProfileFailed,
    } = friendActionsCreators;
    const {
      fetchNewsSuccess,
      fetchNewsFailed,
      fetchLikeSuccess,
      fetchLikeFailed,
    } = newsActionsCreators;
    if (newsList.length > 0) {
      fire
        .firestore()
        .collection("user")
        .where("email", "==", localStorage.getItem("user"))
        .get()
        .then((data) => {
          data.forEach((doc) => {
            localStorage.setItem("friend", doc.data().email);
            let currentFriend = {
              friendId: doc.id,
              email: doc.data().email,
              gender: doc.data().gender,
              nameFriend: doc.data().nameUser,
              date: doc.data().date,
              avatar: doc.data().avatar,
            };
            fetchFriendProfileSuccess(currentFriend);
          });
          fetchNewsSuccess(null, localStorage.getItem("user"));
          fetchLikeSuccess(null, localStorage.getItem("user"));
        })
        .catch((error) => {
          fetchNewsFailed(error);
          fetchLikeFailed(error);
          fetchFriendProfileFailed(error);
          console.error(error);
        });
    } else {
      const { newsActionsCreators } = this.props;
      const {
        fetchNewsSuccess,
        fetchNewsFailed,
        fetchLikeSuccess,
        fetchLikeFailed,
      } = newsActionsCreators;

      fire
        .firestore()
        .collection("news")
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
          let news = [];
          data.forEach((doc) => {
            if(doc.data().email === localStorage.getItem('user')){
              news.push({
                newsId: doc.id,
                email: doc.data().email,
                nameUser: doc.data().nameUser,
                image: doc.data().image,
                content: doc.data().content,
                createdAt: doc.data().createdAt,
                shareCount: doc.data().shareCount,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                avatar: doc.data().avatar,
                nameImage: doc.data().nameImage,
              });
            }
          });
          fetchNewsSuccess(news);
          //lấy dữ liệu trên firebase có database là likes
          fire
            .firestore()
            .collection("likes")
            .where("email", "==", localStorage.getItem("user"))
            .get()
            .then((data) => {
              const likeList = [];
              data.forEach((doc) => {
                likeList.push({
                  likeId: doc.id,
                  email: doc.data().email,
                  newsId: doc.data().newsId,
                  emailFriend: doc.data().emailFriend,
                });
              });
              fetchLikeSuccess(likeList);
            })
            .catch((err) => {
              fetchLikeFailed(err);
            });
        })
        .catch((err) => {
          console.log(err);
          fetchNewsFailed(err);
        });
    }
  }
  //update ảnh
  onUpdateAvatar = () => {
    const { currentUser, userActionsCreators } = this.props;
    const { addAvatarUserSuccess, addAvatarUserFailed } = userActionsCreators;
    const { image } = this.state;
    //lấy dữ liệu trên firebase có database là videos
    if (image) {
      const uploadTask = fire
        .storage()
        .ref(`${image.name}`) //tên để image để lấy dữ liệu
        .put(image); //file image để put lên storage
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        (error) => {
          //error function
          console.log(error);
        },
        () => {
          //complete function
          fire
            .storage()
            .ref()
            //tìm video có tên là video.name rồi lấy link
            .child(image.name)
            .getDownloadURL()
            .then((link) => {
              //update db vào firebase
              fire
                .firestore()
                .collection("user")
                .doc(`${currentUser.userId}`)
                .update({ avatar: link })
                .then((doc) => {
                  fire
                    .firestore()
                    .collection("user")
                    .where("email", "==", localStorage.getItem("user"))
                    .get()
                    .then((data) => {
                      data.forEach((doc) => {
                        let currentUsers = {
                          userId: doc.id,
                          email: doc.data().email,
                          gender: doc.data().gender,
                          nameUser: doc.data().nameUser,
                          date: doc.data().date,
                          avatar: doc.data().avatar,
                          password: doc.data().password,
                        };
                        addAvatarUserSuccess(currentUsers);
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                });

              fire
                .firestore()
                .collection("news")
                .where("email", "==", currentUser.email)
                .get()
                .then((data) => {
                  data.forEach((doc) => {
                    fire
                      .firestore()
                      .collection("news")
                      .doc(`${doc.id}`)
                      .update({ avatar: link })
                      .catch((err) => {
                        console.error(err);
                      });
                  });
                });

              this.setState({
                image: null,
                url: "",
                progress: 0,
              });
            })
            .catch((err) => {
              console.log(err);
              addAvatarUserFailed(err);
            });
        }
      );
    }
  };
  //sửa profile
  handleUpdateUser = () => {
    const { currentUser, userActionsCreators } = this.props;
    const {
      updateUserSuccess,
      updateUserFailed,
      fetchCurrentUser,
    } = userActionsCreators;
    //lấy dữ liệu trên firebase có database là videos
    fire
      .firestore()
      .collection("user")
      .where("email", "==", localStorage.getItem("user"))
      .get()
      .then((data) => {
        data.forEach((doc) => {
          let currentUsers = {
            userId: doc.id,
            email: doc.data().email,
            gender: doc.data().gender,
            nameUser: doc.data().nameUser,
            date: doc.data().date,
            avatar: doc.data().avatar,
            password: doc.data().password,
          };
          fetchCurrentUser(currentUsers);
          if (!this.state.nameUser.length > 0) {
            this.setState({ nameUser: currentUsers.nameUser });
          }
          if (!this.state.date.length > 0) {
            this.setState({ date: currentUsers.date });
          }
          if (!this.state.password.length > 0) {
            this.setState({ password: currentUsers.password });
          }
        });
      });
    fire
      .auth()
      .signInWithEmailAndPassword(
        localStorage.getItem("user"),
        currentUser.password
      )
      .then((user) => {
        fire
          .auth()
          .currentUser.updatePassword(this.state.password)
          .then(() => {
            fire
              .firestore()
              .collection("user")
              .doc(`${currentUser.userId}`)
              .update({
                nameUser: this.state.nameUser,
                date: this.state.date,
                password: this.state.password,
                gender: this.state.nam ? "nam" : "nu",
              })
              .then((doc) => {
                updateUserSuccess({
                  nameUser: this.state.nameUser,
                  date: this.state.date,
                  password: this.state.password,
                  gender: this.state.nam ? "nam" : "nu",
                });
                fire
                  .firestore()
                  .collection("news")
                  .where("email", "==", localStorage.getItem("user"))
                  .get()
                  .then((data) => {
                    data.forEach((doc) => {
                      fire
                        .firestore()
                        .collection("news")
                        .doc(`${doc.id}`)
                        .update({ nameUser: this.state.nameUser })
                        .catch((err) => {
                          console.error(err);
                        });
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              })
              .catch((err) => {
                console.error(err);
                updateUserFailed(err);
              });
          })
          .catch((err) => {
            console.error(err);
            updateUserFailed(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
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
  //các bài viết của bản thân
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

  render() {
    const { classes, currentUser } = this.props;
    return (
      <Grid container spacing={2} style={{ marginTop: "70px" }}>
        <Grid item md={2} xs={12}></Grid>
        <Grid item md={8} xs={12}>
          <Grid container>
            <Grid item md={5} xs={12}>
              <h2 style={{ textAlign: "center" }}>
                <strong>Ảnh Đại Diện</strong>
              </h2>
              <Container fixed>
                <Avatar
                  src={currentUser.avatar}
                  style={{ width: "100%", height: "100%" }}
                />

                <Grid container>
                  <Grid item md={3} xs={6}></Grid>
                  <Grid item md={2} xs={6}>
                    <div style={{ marginLeft: "40px" }}>
                      <input
                        className={classes.input}
                        id="icon-button-file"
                        type="file"
                        onChange={this.handleChangeFile}
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <PhotoCamera fontSize="large" />
                        </IconButton>
                      </label>
                    </div>

                    <div>
                      <progress
                        value={this.state.progress}
                        max="100"
                        style={{ height: "20px" }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={1} xs={6}></Grid>
                </Grid>

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ width: "100%", marginLeft: "auto" }}
                  size="small"
                  type="button"
                  onClick={this.onUpdateAvatar}
                >
                  <CloudUploadIcon fontSize="small" />
                  Lưu
                </Button>
              </Container>
            </Grid>
            <Grid item md={7} xs={12}>
              <h2 style={{ textAlign: "center" }}>
                <strong>Thông Tin</strong>
              </h2>
              {currentUser.nameUser.length > 0 ? (
                <Fragment>
                  <TextField
                    id="nameUser"
                    name="nameUser"
                    type="text"
                    label="Name"
                    defaultValue={currentUser.nameUser}
                    className={classes.textField}
                    fullWidth
                    onChange={this.handleChangeContent}
                  />
                  <TextField
                    id="date"
                    name="date"
                    type="date"
                    label="Birthday"
                    className={classes.textField}
                    fullWidth
                    defaultValue={currentUser.date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.handleChangeContent}
                  />
                  <Grid container>
                    <Grid item sm>
                      {this.state.checkednam ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="nam"
                              onChange={this.handleChange}
                              color="primary"
                            />
                          }
                          label="Nam"
                        />
                      ) : (
                        <FormControlLabel
                          disabled
                          control={
                            <Checkbox
                              name="nam"
                              onChange={this.handleChange}
                              color="primary"
                            />
                          }
                          label="Nam"
                        />
                      )}
                    </Grid>
                    <Grid item sm>
                      <WcIcon fontSize="large" />
                    </Grid>
                    <Grid item sm>
                      {this.state.checkednu ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="nu"
                              onChange={this.handleChange}
                              color="primary"
                            />
                          }
                          label="Nữ"
                        />
                      ) : (
                        <FormControlLabel
                          disabled
                          control={
                            <Checkbox
                              name="nu"
                              onChange={this.handleChange}
                              color="primary"
                            />
                          }
                          label="Nữ"
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item md={5} xs={6}>
                      <TextField
                        id="password"
                        name="password"
                        type={this.state.showPassword ? "text" : "password"}
                        label="Password"
                        defaultValue={currentUser.password}
                        className={classes.textField}
                        fullWidth
                        onChange={this.handleChangeContent}
                      />
                    </Grid>
                    <Grid item md={1} xs={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        className={classes.button}
                        style={{ marginTop: "15px" }}
                        onClick={() => {
                          this.setState({
                            showPassword: !this.state.showPassword,
                          });
                        }}
                      >
                        {this.state.showPassword ? (
                          <VisibilityIcon fontSize="small" />
                        ) : (
                          <VisibilityOffIcon fontSize="small" />
                        )}
                      </Button>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    style={{ width: "100%", marginLeft: "auto" }}
                    className={classes.button}
                    onClick={this.handleUpdateUser}
                  >
                    <CloudUploadIcon fontSize="small" />
                    Lưu
                  </Button>
                </Fragment>
              ) : (
                <strong>Loading...</strong>
              )}
            </Grid>
          </Grid>
          {this.renderNewsList()}
        </Grid>
        <Grid item md={2} xs={12}></Grid>
      </Grid>
    );
  }
}

Profile.propTypes = {
  classes: propTypes.object,
  newsList: propTypes.array,
  likeList: propTypes.array,
  userActionsCreators: propTypes.shape({
    addAvatarUserSuccess: propTypes.func,
    addAvatarUserFailed: propTypes.func,
    updateUserSuccess: propTypes.func,
    updateUserFailed: propTypes.func,
    fetchCurrentUser: propTypes.func,
  }),
  newsActionsCreators: propTypes.shape({
    fetchNewsSuccess: propTypes.func, //
    fetchNewsFailed: propTypes.func, //
    likeNewsSuccess: propTypes.func, //
    likeNewsFailed: propTypes.func, //
    unlikeNewsSuccess: propTypes.func, //
    unlikeNewsFailed: propTypes.func, //
  }),
  handleSubmit: propTypes.func,
  invalid: propTypes.bool,
  submitting: propTypes.bool,
  currentUser: propTypes.object,
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    newsList: state.news.newsList,
    likeList: state.news.likeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActionsCreators: bindActionCreators(userActions, dispatch),
    newsActionsCreators: bindActionCreators(newsActions, dispatch),
    friendActionsCreators: bindActionCreators(friendActions, dispatch),
  };
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Profile);

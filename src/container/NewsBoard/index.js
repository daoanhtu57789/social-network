import React, { Component, Fragment } from "react";
//css
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid, Avatar, TextField } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/Add";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
//componet
import NewsList from "../../component/NewsList/index";
//kết nối đến store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//kiểm tra dữ liệu nhận vào
import propTypes from "prop-types";
//actions
import * as newsActions from "./../../actions/news";
import * as uiActions from "./../../actions/ui";
import * as modalActions from "./../../actions/modal";
//firebase
import fire from "./../../config/Fire";
//redux-form
import { Field, reduxForm } from "redux-form";
import { CircularProgress } from "@material-ui/core";
import renderTextField from "./../../component/FormHelper/TextField/index";
//redux
import { compose } from "redux";

class NewsBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: "",
      progress: 0,
      content: "",
    };
  }
  handleChangeFile = (event) => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState({ image });
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangeContent = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  //////load trang
  componentDidMount() {
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
          news.push({
            newsId: doc.id,
            email: doc.data().email,
            nameUser: doc.data().nameUser,
            link: doc.data().link,
            content: doc.data().content,
            createdAt: doc.data().createdAt,
            shareCount: doc.data().shareCount,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
            image: doc.data().image,
            nameLink: doc.data().nameLink,
          });
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
  //like
  onClickLike = (data) => {
    const { newsActionsCreators } = this.props;
    const { likeNewsSuccess, likeNewsFailed } = newsActionsCreators;
    const like = {
      newsId: data.newsId,
      email: localStorage.getItem("user"),
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
  //Xác nhận xóa news
  onClickDelete = (data) => {
    const { modalActionsCreators } = this.props;
    const {
      showModal,
      changeTitle,
      changeModal,
      hideModal,
    } = modalActionsCreators;
    showModal();
    changeTitle("Xóa Bài Viết");
    changeModal(
      <Grid container>
        <Grid item md={2} xs={12}></Grid>
        <Grid item md={8} xs={12}>
          <strong>Bạn có chắc muốn xóa bài viết này.</strong>
          <Grid container>
            <Grid item md={5} xs={8}>
              <Button color="secondary" onClick={() => this.handleDelete(data)}>
                Yes
              </Button>
            </Grid>
            <Grid item md={3} xs={8}>
              <Button color="primary" onClick={hideModal}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={2} xs={12}></Grid>
      </Grid>
    );
  };
  //Thực hiện xóa News
  handleDelete = (data) => {
    const { newsActionsCreators, modalActionsCreators } = this.props;
    const { deleteNewsFailed, deleteNewsSuccess } = newsActionsCreators;
    const { hideModal } = modalActionsCreators;
    hideModal();
    //Xóa database news với newsId
    fire
      .firestore()
      .collection("news")
      .doc(`${data.newsId}`)
      .delete()
      .then((doc) => {
        deleteNewsSuccess(data.newsId);
      })
      .catch((err) => {
        deleteNewsFailed(err);
        console.log(err);
      });
    //xóa video hoặc ảnh
    if (data.nameLink) {
      fire.storage().ref(`${data.nameLink}`).delete();
    }

    fire
      .firestore()
      .collection("likes")
      .where("newsId", "==", data.newsId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          fire.firestore().collection("likes").doc(`${doc.id}`).delete();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Mở form sửa
  onClickEdit = (data) => {
    const { modalActionsCreators, showLoadingLogin, classes } = this.props;
    const { showModal, changeTitle, changeModal } = modalActionsCreators;
    showModal();
    changeTitle("Sửa Bài Viết.");
    changeModal(
      <Fragment>
        <TextField
          id="content"
          name="content"
          type="text"
          variant="outlined"
          className={classes.textField}
          defaultValue={data.content}
          onChange={this.handleChangeContent}
          multiline
          rows="4"
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          style={{ width: "100%", marginLeft: "auto" }}
          size="small"
          type="button"
          onClick={() => this.handleEdit(data)}
          disabled={showLoadingLogin}
        >
          <CloudUploadIcon fontSize="small" />
          Sửa
          {showLoadingLogin && (
            <CircularProgress size={30} className={classes.progress} />
          )}
        </Button>
      </Fragment>
    );
  };
  //thực hiện sửa
  handleEdit = (data) => {
    const { newsActionsCreators, modalActionsCreators } = this.props;
    const { updateNewsSuccess, updateNewsFailed } = newsActionsCreators;
    const { hideModal } = modalActionsCreators;
    fire
      .firestore()
      .collection("news")
      .doc(`${data.newsId}`)
      .update({
        content: this.state.content,
      })
      .then((doc) => {
        updateNewsSuccess(this.state.content, data.newsId);

        hideModal();
      })
      .catch((err) => {
        console.log(err);
        updateNewsFailed(err);
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
          onClickDelete={this.onClickDelete}
          onClickEdit={this.onClickEdit}
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
  //Thêm news
  handleSubmit = (data) => {
    //reset để reset lại form
    const {
      newsActionsCreators,
      uiActionsCreators,
      currentUser,
      reset,
    } = this.props;
    const { addNewsSuccess, addNewsFailed } = newsActionsCreators;
    const { hideLoadingLogin, showLoadingLogin } = uiActionsCreators;
    //update file xong trước mới update database
    const { image } = this.state;
    //
    if (image) {
      const uploadTask = fire
        .storage()
        .ref(`${image.name}`) //tên để image để lấy dữ liệu
        .put(image); //file image để put lên storage
      showLoadingLogin();
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
              const news = {
                email: currentUser.email,
                nameUser: currentUser.nameUser,
                link: link,
                createdAt: new Date().toISOString(),
                shareCount: 0,
                likeCount: 0,
                commentCount: 0,
                content: data.content,
                image: currentUser.linkImage,
                nameLink: image.name,
              };
              //thêm db vào firebase
              fire
                .firestore()
                .collection("news")
                .add(news)
                .then((doc) => {
                  doc.get().then((doc) => {
                    addNewsSuccess({ newsId: doc.id, ...news });
                  });
                });
              reset();
              hideLoadingLogin();

              this.setState({
                image: null,
                url: "",
                progress: 0,
              });
            })
            .catch((err) => {
              console.log(err);
              addNewsFailed(err);
            });
        }
      );
    } else {
      const news = {
        email: currentUser.email,
        nameUser: currentUser.nameUser,
        link: "",
        createdAt: new Date().toISOString(),
        shareCount: 0,
        likeCount: 0,
        commentCount: 0,
        content: data.content,
        image: currentUser.linkImage,
        nameLink: "",
      };
      //thêm db vào firebase
      fire
        .firestore()
        .collection("news")
        .add(news)
        .then((doc) => {
          doc
            .get()
            .then((doc1) => {
              addNewsSuccess({ newsId: doc.id, ...news });
            })
            .catch((err) => {
              console.log(err);
              addNewsFailed(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      //reset lại text field
      reset();
      hideLoadingLogin();
      this.setState({
        image: null,
        url: "",
        progress: 0,
      });
    }
  };

  render() {
    const { classes, handleSubmit, showLoadingLogin, currentUser } = this.props;
    return (
      <Grid container spacing={2} style={{ paddingTop: "10px" }}>
        <Grid item md={3} xs={12}></Grid>
        <Grid item md={6} xs={12}>
          <form onSubmit={handleSubmit(this.handleSubmit)}>
            <Card className={classes.cardContent}>
              <Grid container style={{ margin: "10px 0 10px 10px" }}>
                <Grid item md={1} xs={12}>
                  <Avatar src={currentUser.linkImage} />
                </Grid>
                <Grid item md={11} xs={12} style={{ marginTop: " 12px" }}>
                  <strong>{currentUser.nameUser}</strong>
                </Grid>
              </Grid>

              <Field
                id="content"
                name="content"
                component={renderTextField}
                type="text"
                variant="outlined"
                className={classes.textField}
                placeholder="Hãy Cho Mọi Người Biết Bạn Đang Nghĩ Gì?"
                multiline
                rows="4"
              />

              <Grid container spacing={2} style={{ paddingTop: "10px" }}>
                <Grid item md={2} xs={12}></Grid>
                <Grid item md={2} xs={12}></Grid>
                <Grid item md={8} xs={12}>
                  <div style={{ marginLeft: "70px" }}>
                    <progress
                      value={this.state.progress}
                      max="100"
                      style={{ marginBottom: "5px", height: "20px" }}
                    />

                    <input
                      className={classes.input}
                      id="icon-button-file"
                      type="file"
                      onChange={this.handleChangeFile}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        style={{ marginTop: "-10px" }}
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera fontSize="large" />
                      </IconButton>
                    </label>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      size="small"
                      type="submit"
                      disabled={showLoadingLogin}
                    >
                      <AddIcon fontSize="small" />
                      Đăng
                      {showLoadingLogin && (
                        <CircularProgress
                          size={30}
                          className={classes.progress}
                        />
                      )}
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Card>
          </form>
          {this.renderNewsList()}
        </Grid>
        <Grid item md={3} xs={12}></Grid>
      </Grid>
    );
  }
}
//check props nhận vào
NewsBoard.propTypes = {
  classes: propTypes.object,
  newsList: propTypes.array,
  newsActionsCreators: propTypes.shape({
    fetchNewsSuccess: propTypes.func,
    fetchNewsFailed: propTypes.func,
    addNewsSuccess: propTypes.func,
    addNewsFailed: propTypes.func,
    deleteNewsFailed: propTypes.func,
    deleteNewsSuccess: propTypes.func,
    updateNewsSuccess: propTypes.func,
    updateNewsFailed: propTypes.func,
    likeNewsSuccess: propTypes.func,
    likeNewsFailed: propTypes.func,
    unlikeNewsSuccess: propTypes.func,
    unlikeNewsFailed: propTypes.func,
  }),
  currentUser: propTypes.object,
  uiActionsCreators: propTypes.shape({
    hideLoadingLogin: propTypes.func,
    showLoadingLogin: propTypes.func,
  }),
  modalActionsCreators: propTypes.shape({
    hideLoadingLogin: propTypes.func,
    showLoadingLogin: propTypes.func,
  }),
};

const mapStateToProps = (state) => {
  return {
    newsList: state.news.newsList,
    currentUser: state.user.currentUser,
    showLoadingLogin: state.user.showLoadingLogin,
    likeList: state.news.likeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    newsActionsCreators: bindActionCreators(newsActions, dispatch),
    uiActionsCreators: bindActionCreators(uiActions, dispatch),
    modalActionsCreators: bindActionCreators(modalActions, dispatch),
  };
};

//kết nối với redux-form
const FORM_NAME = "TASK_MANAGEMENT";
const withReduxForm = reduxForm({
  form: FORM_NAME,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withReduxForm
)(NewsBoard);

import React, { Component } from "react";
//css
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid, Avatar } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/Add";
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
      progress: 0
    };
  }
  handleChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState({ image });
    }
  };

  //////load trang
  componentDidMount() {
    const { newsActionsCreator } = this.props;
    const { fetchNewsSuccess, fetchNewsFailed } = newsActionsCreator;

    fire
      .firestore()
      .collection("news")
      .orderBy("createdAt", "desc")
      .get()
      .then(data => {
        let news = [];
        data.forEach(doc => {
          news.push({
            newsId: doc.id,
            nameUser: doc.data().nameUser,
            link: doc.data().link,
            content: doc.data().content,
            createdAt: doc.data().createdAt,
            shareCount: doc.data().shareCount,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
            image: doc.data().image
          });
        });
        fetchNewsSuccess(news);
      })
      .catch(err => {
        console.log(err);
        fetchNewsFailed(err);
      });
  }
  //////
  renderNewsList = () => {
    const { newsList } = this.props;
    let xhtml = null;
    if (newsList.length > 0) {
      xhtml = <NewsList newsList={newsList} />;
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
  handleSubmit = data => {
    //reset để reset lại form
    const { newsActionsCreator, uiActionCreators, currentUser,reset } = this.props;
    const { addNewsSuccess, addNewsFailed } = newsActionsCreator;
    const { hideLoadingLogin, showLoadingLogin } = uiActionCreators;
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
        snapshot => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
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
            .then(link => {
              const news = {
                email: currentUser.email,
                nameUser: currentUser.nameUser,
                link: link,
                createdAt: new Date().toISOString(),
                shareCount: 0,
                likeCount: 0,
                commentCount: 0,
                content: data.content,
                image: currentUser.linkImage
              };
              addNewsSuccess(news);
              //thêm db vào firebase
              fire
                .firestore()
                .collection("news")
                .add(news);
              reset();
              hideLoadingLogin();
              
              this.setState({
                image: null,
                url: "",
                progress: 0
              });
            })
            .catch(err => {
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
        image: currentUser.linkImage
      };
      addNewsSuccess(news);
      //thêm db vào firebase
      fire
        .firestore()
        .collection("news")
        .add(news);
        //reset lại text field
        reset();
      hideLoadingLogin();
      this.setState({
        image: null,
        url: "",
        progress: 0
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
                      onChange={this.handleChange}
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
  newsActionsCreator: propTypes.shape({
    fetchNewsSuccess: propTypes.func,
    fetchNewsFailed: propTypes.func,
    addNewsSuccess: propTypes.func,
    addNewsFailed: propTypes.func
  }),
  currentUser: propTypes.object
};

const mapStateToProps = state => {
  return {
    newsList: state.news.newsList,
    currentUser: state.user.currentUser,
    showLoadingLogin: state.user.showLoadingLogin,
    initialValues: {
      content: state.user.showLoadingLogin ? null : null
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    newsActionsCreator: bindActionCreators(newsActions, dispatch),
    uiActionCreators: bindActionCreators(uiActions, dispatch)
  };
};

//kết nối với redux-form
const FORM_NAME = "TASK_MANAGEMENT";
const withReduxForm = reduxForm({
  form: FORM_NAME
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withReduxForm
)(NewsBoard);

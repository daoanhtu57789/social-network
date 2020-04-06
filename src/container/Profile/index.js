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
//redux-form
import { reduxForm } from "redux-form";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiActions from "./../../actions/ui";
import * as userActions from "./../../actions/user";
import { compose } from "redux";
//firebase
import fire from "./../../config/Fire";
class Profile extends Component {
  constructor(props) {
    super(props);
    const { currentUser } = this.props;
    this.state = {
      image: null,
      url: "",
      progress: 0,
      nam: false,
      nu: false,
      checkednam: currentUser.gender === "nu" ? true : false,
      checkednu: currentUser.gender === "nu" ? false : true,
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

  componentDidMount() {
    const { userActionsCreators } = this.props;
    const { fetchCurrentUser } = userActionsCreators;
    //lấy dữ liệu trên firebase có database là videos
    fire
      .firestore()
      .collection("user")
      .where("email", "==", localStorage.getItem("user"))
      .get()
      .then((data) => {
        data.forEach((doc) => {
          let currentUser = {
            userId: doc.id,
            email: doc.data().email,
            gender: doc.data().gender,
            nameUser: doc.data().nameUser,
            date: doc.data().date,
            avatar: doc.data().avatar,
            password: doc.data().password,
          };
          fetchCurrentUser(currentUser);
        });
      });
  }

  //update ảnh
  onUpdateAvatar = (data) => {
    const {
      currentUser,
      userActionsCreators,
      uiActionsCreators,
      handleUpdateAvatar,
    } = this.props;
    const { addAvatarUserSuccess, addAvatarUserFailed } = userActionsCreators;
    const { hideLoadingLogin, showLoadingLogin } = uiActionsCreators;
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
              addAvatarUserSuccess(link);
              handleUpdateAvatar(link);
              //update db vào firebase
              fire
                .firestore()
                .collection("user")
                .doc(`${currentUser.userId}`)
                .update({ avatar: link })
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

              hideLoadingLogin();

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
  //lấy user đang sửa
  //submit
  handleSubmit = (data) => {
    console.log(data);
  };
  render() {
    const { classes, handleSubmit, currentUser } = this.props;
    return (
      <Grid container spacing={2} style={{ marginTop: "70px" }}>
        <Grid item md={2} xs={12}></Grid>
        <Grid item md={3} xs={12}>
          <h2 style={{ textAlign: "center" }}>
            <strong>Ảnh Đại Diện</strong>
          </h2>
          <form onSubmit={handleSubmit(this.onUpdateAvatar)}>
            <Container fixed>
              <Avatar
                style={{ width: "100%", height: "100%" }}
                src={currentUser.avatar}
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
                type="submit"
                onClick={this.onUpdateAvatar}
              >
                <CloudUploadIcon fontSize="small" />
                Lưu
              </Button>
            </Container>
          </form>
        </Grid>
        <Grid item md={5} xs={12}>
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
              />
              <Grid container>
                <Grid item sm>
                  {!this.state.checkednam ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked
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
                  {!this.state.checkednu ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked
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
                    type="password"
                    label="Password"
                    defaultValue={currentUser.password}
                    className={classes.textField}
                    fullWidth
                  />
                </Grid>
                <Grid item md={1} xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    className={classes.button}
                    style={{ marginTop: "15px" }}
                  >
                    <VisibilityOffIcon fontSize="small" />
                  </Button>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                type="button"
                style={{ width: "100%", marginLeft: "auto" }}
                className={classes.button}
              >
                <CloudUploadIcon fontSize="small" />
                Lưu
              </Button>
            </Fragment>
          ) : (
            <strong>Loading...</strong>
          )}
        </Grid>
        <Grid item md={2} xs={12}></Grid>
      </Grid>
    );
  }
}

Profile.propTypes = {
  classes: propTypes.object,
  userActionsCreators: propTypes.shape({
    addAvatarUserSuccess: propTypes.func,
    addAvatarUserFailed: propTypes.func,
    updateUserSuccess: propTypes.func,
    updateUserFailed: propTypes.func,
  }),
  handleSubmit: propTypes.func,
  invalid: propTypes.bool,
  submitting: propTypes.bool,
  showLoadingSignup: propTypes.bool,
  currentUser: propTypes.object,
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActionsCreators: bindActionCreators(userActions, dispatch),
    uiActionsCreators: bindActionCreators(uiActions, dispatch),
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
)(Profile);

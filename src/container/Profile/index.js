import React, { Component } from "react";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

import propTypes from "prop-types";
//material
import WcIcon from "@material-ui/icons/Wc";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { CircularProgress } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Grid, Button, Avatar } from "@material-ui/core";
//icon
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import FormControl from "@material-ui/core/FormControl";
//redux-form
import { Field, reduxForm } from "redux-form";
import renderTextField from "./../../component/FormHelper/TextField/index";
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
    this.state = {
      image: null,
      url: "",
      progress: 0,
      nam: false,
      nu: false,
      checkednam: false,
      checkednu: false,
    };
  }
  handleChange = (event) => {
    if (event.target.name === "nam" && event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednu: true,
      });
    } else if (event.target.name === "nu" && event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednam: true,
      });
    }

    if (event.target.name === "nam" && !event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednu: false,
      });
    } else if (event.target.name === "nu" && !event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednam: false,
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
    const {
      classes,
      handleSubmit,
      showLoadingSignup,
      invalid,
      submitting,
      currentUser,
    } = this.props;
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
          <form onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              id="nameUser"
              name="nameUser"
              type="text"
              label="Name"
              className={classes.textField}
              fullWidth
              component={renderTextField}
            />
            <Field
              id="date"
              name="date"
              type="date"
              label="Birthday"
              className={classes.textField}
              fullWidth
              component={renderTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Grid container>
              <Grid item sm>
                <FormControl>
                  {currentUser.gender === "nam" ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked = {true}
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
                </FormControl>
              </Grid>
              <Grid item sm>
                <WcIcon fontSize="large" />
              </Grid>
              <Grid item sm>
                <FormControl>
                  {currentUser.gender === "nu" ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked = {true}
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
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={5} xs={6}>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  className={classes.textField}
                  fullWidth
                  component={renderTextField}
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
              disabled={invalid || submitting || showLoadingSignup}
              variant="contained"
              color="primary"
              type="submit"
              style={{ width: "100%", marginLeft: "auto" }}
              className={classes.button}
            >
              <CloudUploadIcon fontSize="small" />
              Lưu
              {showLoadingSignup && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
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
    userEditing: propTypes.func,
  }),
  handleSubmit: propTypes.func,
  invalid: propTypes.bool,
  submitting: propTypes.bool,
  showLoadingSignup: propTypes.bool,
  currentUser: propTypes.object,
};

const mapStateToProps = (state) => {
  if (state.user.userEditing.nameUser !== undefined) {
    return {
      showLoadingSignup: state.ui.showLoadingSignup,
      currentUser: state.user.currentUser,
      userEditing: state.user.userEditing,
      initialValues: {
        nameUser: state.user.userEditing
          ? state.user.userEditing.nameUser
          : null,
        date: state.user.userEditing ? state.user.userEditing.date : null,
        password: state.user.userEditing
          ? state.user.userEditing.password
          : null,
      },
    };
  }
  return {
    showLoadingSignup: state.ui.showLoadingSignup,
    currentUser: state.user.currentUser,
    userEditing: state.user.userEditing,
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

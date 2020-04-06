import React, { Component } from "react";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import propTypes from "prop-types";

import AppIcon from "./../../assets/images/zero-social.jpg";
import { Link } from "react-router-dom";

//thông báo khi lỗi
// import { toastError, toastSuccess } from "./../../helpers/toastHelpers";
//redux-form
import { Field, reduxForm } from "redux-form";
import renderTextField from "./../../component/FormHelper/TextField/index";
import validate from "./formValidate";
//redux
import { compose } from "redux";
// MUI Stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import WcIcon from "@material-ui/icons/Wc";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
//kết nối store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiActions from "./../../actions/ui";
import * as userActions from "./../../actions/user";
import { CircularProgress } from "@material-ui/core";
//firebase
import fire from "./../../config/Fire";

class Signup extends Component {
  state = {
    nam: false,
    nu: false,
    checkednam: false,
    checkednu: false
  };
  handleSubmit = data => {
    const { uiActionCreators, userActionCreators } = this.props;
    const { showLoadingSignup, hideLoadingSignup } = uiActionCreators;
    const { fetchCurrentUser } = userActionCreators;
    showLoadingSignup();
    if (data.password === data.confirmPassword) {
      fire
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(() => {
          const newUser = {
            email: data.email,
            password: data.password,
            nameUser: data.nameUser,
            date: data.date,
            gender: this.state.nam ? "nam" : "nu",
            avatar: this.state.nam
              ? "https://firebasestorage.googleapis.com/v0/b/zero-social-43e41.appspot.com/o/man.png?alt=media&token=23c40781-f7fc-4f16-9114-a6eea27850ee"
              : "https://firebasestorage.googleapis.com/v0/b/zero-social-43e41.appspot.com/o/woman.jpg?alt=media&token=ee7639c0-fcb3-4f34-9111-1c2242e6802b"
          };
          
          fire
            .firestore()
            .collection("user")
            .add(newUser).then(doc => {
              fetchCurrentUser({userId : doc.id,...newUser}); 
            })
          hideLoadingSignup();
        })
        .catch(error => {
          console.log(error);
          hideLoadingSignup();
        });
    } else {
      hideLoadingSignup();
    }
  };

  handleChange = event => {
    if (event.target.name === "nam" && event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednu: true
      });
    } else if (event.target.name === "nu" && event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednam: true
      });
    }

    if (event.target.name === "nam" && !event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednu: false
      });
    } else if (event.target.name === "nu" && !event.target.checked) {
      this.setState({
        [event.target.name]: event.target.checked,
        checkednam: false
      });
    }
  };

  render() {
    const {
      classes,
      showLoadingSignup,
      handleSubmit,
      invalid,
      submitting
    } = this.props;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="corgi" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            SignUp
          </Typography>
          <form onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              fullWidth
              component={renderTextField}
            />
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
                shrink: true
              }}
            />
            <Grid container>
              <Grid item sm>
                {!this.state.checkednam ? (
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
                {!this.state.checkednu ? (
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

            <Field
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              fullWidth
              component={renderTextField}
            />
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              fullWidth
              component={renderTextField}
            />

            <Button
              disabled={invalid || submitting || showLoadingSignup}
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            >
              SignUp
              {showLoadingSignup && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              Already have an account ? Login <Link to="/login">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

//check props nhận vào
Signup.propTypes = {
  classes: propTypes.object,
  userActionsCreator: propTypes.shape({
    fetchCurrentUser: propTypes.func
  }),
  handleSubmit: propTypes.func,
  invalid: propTypes.bool,
  submitting: propTypes.bool,
  showLoadingSignup: propTypes.bool
};

const mapStateToProps = state => {
  return {
    showLoadingSignup: state.ui.showLoadingSignup
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActionCreators: bindActionCreators(userActions, dispatch),
    uiActionCreators: bindActionCreators(uiActions, dispatch)
  };
};

//kết nối với redux-form
const FORM_NAME = "TASK_MANAGEMENT";
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withReduxForm
)(Signup);

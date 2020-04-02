import React, { Component } from "react";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import propTypes from "prop-types";
// import AppIcon from "../../assets/images/corgi.jpg";
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
//kết nối store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiActions from "./../../actions/ui";
import * as userActions from "./../../actions/user";
import { CircularProgress } from "@material-ui/core";
//firebase
import fire from "./../../config/Fire";

class Signup extends Component {
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
            email : data.email,
            password : data.password,
            nameUser : data.nameUser,
            date : data.date,
          }
          fetchCurrentUser(newUser);
          fire.firestore().collection('user').add(newUser);
          hideLoadingSignup();
        })
        .catch(error => {
          hideLoadingSignup();
        });
    } else {
      hideLoadingSignup();
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
          {/* <img src={AppIcon} alt="corgi" className={classes.image} /> */}
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

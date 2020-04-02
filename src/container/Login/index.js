import React, { Component } from "react";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import AppIcon from "./../../assets/images/corgi.jpg";
import { Link } from "react-router-dom";

import { withRouter } from "react-router-dom";
// MUI Stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
//kết nối store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiActions from "./../../actions/ui";
//firebase
import fire from "./../../config/Fire";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  //sự kiện thay đổi bàn phím

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    //kết nối đến các tài khoản trên firebase
    //bắt sự kiện thay đổi tài khoản
    const { history } = this.props;
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem('user',user.email);
        history.push("/home");
      } else {
        localStorage.setItem('user',null);
        history.push("/login");
      }
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { uiActionCreators, history } = this.props;
    const { showLoadingLogin, hideLoadingLogin } = uiActionCreators;
    showLoadingLogin();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(u => {
        hideLoadingLogin();
        if (history) {
          history.push("/home");
        }
      })
      .catch(error => {
        alert(error.message);
        hideLoadingLogin();
      });
  };
  render() {
    const { classes, showLoadingLogin } = this.props;
    const { errors } = this.state;

    return (
      <Grid container className={classes.form}>
        {/*  */}
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="corgi" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={showLoadingLogin}
            >
              Login
              {showLoadingLogin && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              dont have an account ? sign up <Link to="/signup">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    showLoadingLogin: state.ui.showLoadingLogin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uiActionCreators: bindActionCreators(uiActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Login)));

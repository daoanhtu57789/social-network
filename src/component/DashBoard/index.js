import React, { Component } from "react";
//các component
import Header from "./Header/index";
//css
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
//kết nối vs store
import { connect } from "react-redux";
//check type
import propTypes from "prop-types";
import { bindActionCreators } from "redux";
//actions
import * as userActions from "./../../actions/user";
//firebase
import fire from "./../../config/Fire";
class DashBoard extends Component {
  componentDidMount() {
    const { userActionsCreator } = this.props;
    const { fetchCurrentUser } = userActionsCreator;
    //lấy dữ liệu trên firebase có database là videos
    fire
      .firestore()
      .collection("user")
      .where("email", "==", localStorage.getItem("user"))
      .get()
      .then(data => {
        data.forEach(doc => {
          let currentUser = {
            userId: doc.id,
            email: doc.data().email,
            gender: doc.data().gender,
            nameUser: doc.data().nameUser,
            date: doc.data().date,
            linkImage: doc.data().linkImage
          };
          fetchCurrentUser(currentUser);
        });
      });
  }

  handleLogout = () => {
    const { userActionsCreator } = this.props;
    const { fetchCurrentUser } = userActionsCreator;
    fetchCurrentUser({
      userId: "",
      email: "",
      gender: "",
      nameUser: "",
      date: "",
      linkImage: ""
    });
  };

  render() {
    const { children, currentUser } = this.props;
    return (
      <div>
        <div>
          <Header currentUser={currentUser} handleLogout={this.handleLogout} />
        </div>
        <div>{children}</div>
      </div>
    );
  }
}

DashBoard.propTypes = {
  children: propTypes.object,
  currentUser: propTypes.object,
  userActionsCreator: propTypes.shape({
    fetchCurrentUser: propTypes.func
  })
};

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActionsCreator: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DashBoard));

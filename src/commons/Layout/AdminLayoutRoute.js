import React, { Component } from "react";
import DashBoard from "./../../component/DashBoard/index";

import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "./../../actions/user";
class AdminLayoutRoute extends Component {
  handleUpdateAvatar = (link) => {
    const{userActionsCreators} = this.props;
    const {addAvatarUserSuccess} = userActionsCreators;
    addAvatarUserSuccess(link);
  };
  render() {
    //cách 1 viết thông thường
    // const {component,exact,name,path} = this.props;
    //cách 2 dùng ES6
    //...remainProps là các props còn lại
    const { component: YourComponent, ...remainProps } = this.props;
    return (
      <Route
        {...remainProps}
        //render —Truyền vào một function, function này sẽ trả về React Component.
        //Nó cũng sẽ được gọi khi trỏ đúng đường dẫn
        render={(routeProps) => {
          return (
            <DashBoard {...remainProps}>
              <YourComponent
                handleUpdateAvatar={this.handleUpdateAvatar}
                {...routeProps}
              />
            </DashBoard>
          );
        }}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userActionsCreators: bindActionCreators(userActions, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(AdminLayoutRoute);

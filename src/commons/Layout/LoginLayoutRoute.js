import React, { Component } from "react";

import { Route } from "react-router-dom";
class LoginLayoutRoute extends Component {
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
        render={routeProps => {
          return <YourComponent {...routeProps} />;
        }}
      />
    );
  }
}

export default LoginLayoutRoute;

import React, { Component } from "react";
//material
import { ThemeProvider } from "@material-ui/core";
import theme from "./../../commons/Theme/theme";
//import để reset css
import CssBaseline from "@material-ui/core/CssBaseline";
//cài đặt route
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import { PAGE_ROUTES, LOGIN_ROUTES } from "./../../constants/index";
import AdminLayoutRoute from "./../../commons/Layout/AdminLayoutRoute";
import LoginLayoutRoute from "./../../commons/Layout/LoginLayoutRoute";
//
import CommonModal from './../../component/Modal/index';

import "./App.css";
//redux
import { Provider } from "react-redux";
//chaỵ configureStore() để lấy được store
import configureStore from "./../../redux/configureStore";

const store = configureStore();

class App extends Component {
  renderAdminRoutes = () => {
    let xhtml = null;

    xhtml = PAGE_ROUTES.map(route => {
      return (
        <AdminLayoutRoute
          key={route.path}
          component={route.component}
          path={route.path}
          exact={route.exact}
        />
      );
    });
    return xhtml;
  };

  renderLoginRoutes = () => {
    let xhtml = null;

    xhtml = LOGIN_ROUTES.map(route => {
      return (
        <LoginLayoutRoute
          key={route.path}
          component={route.component}
          path={route.path}
          exact={route.exact}
        />
      );
    });
    return xhtml;
  };
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CommonModal/>
            <Switch>
              {this.renderAdminRoutes()}
              {this.renderLoginRoutes()}
              {/* phải load được các component rồi mới chuyển trang login 
                  Redirect điều hướng đến /admin khi load xong trang
                */}
              <Redirect to="/login" />
            </Switch>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;

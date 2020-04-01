import React from "react";
//material
import { ThemeProvider } from "@material-ui/core";
import theme from "./../../commons/Theme/theme";
//import để reset css
import CssBaseline from "@material-ui/core/CssBaseline";
//các container
import "./App.css";
//component
import DashBoard from "./../../component/DashBoard/index";
//redux
import { Provider } from "react-redux";
//chaỵ configureStore() để lấy được store
import configureStore from "./../../redux/configureStore";

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DashBoard />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

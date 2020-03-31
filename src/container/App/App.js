import React from 'react';
//material
import {ThemeProvider}from '@material-ui/core';
import theme from './../../commons/Theme/theme';
//import để reset css
import CssBaseline from "@material-ui/core/CssBaseline";
//các container
import './App.css';
//component
import DashBoard from './../../component/DashBoard/index';

function App() {
  return (
    <ThemeProvider theme={theme}>  
      <CssBaseline />
      <DashBoard />
    </ThemeProvider>
  );
}

export default App;

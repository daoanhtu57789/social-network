import React, { Component } from 'react';
//các component 
import Header from './Header/index';
//css
import styles from './styles';
import {withStyles} from '@material-ui/core/styles';
class DashBoard extends Component {
    render() {
        return (
            <div>
                <Header />    
            </div>
        );
    }
};

export default withStyles(styles)(DashBoard);
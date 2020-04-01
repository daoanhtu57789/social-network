import React, { Component } from 'react';
//các component 
import Header from './Header/index';
import NewsBoard from './../../container/NewsBoard/index';
//css
import styles from './styles';
import {withStyles} from '@material-ui/core/styles';
class DashBoard extends Component {
    render() {
        return (
            <div>
                <div>
                    <Header />  
                </div>
                <div>
                    <NewsBoard />
                </div>  
            </div>
        );
    }
};

export default withStyles(styles)(DashBoard);
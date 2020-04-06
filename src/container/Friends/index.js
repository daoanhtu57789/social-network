import React, { Component } from 'react';
//css
import {withStyles} from '@material-ui/core/styles';
import styles from './style';
//check props
import propTypes from 'prop-types';
class Friends extends Component {
    render() {
        return (
            <div>
                
            </div>
        );
    }
};

Friends.propTypes = {
    classes : propTypes.object
}

export default withStyles(styles)(Friends);
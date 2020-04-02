import React from 'react';
import { TextField } from '@material-ui/core';
import propTypes from 'prop-types';
//có 2 cách viết component là function component và class component
//đây là viết function component,cách này ko sử dụng được lifecricle hoặc các state local
const renderTextField = ({
    label,
    input,
    meta: { touched, invalid, error },
    //ngoài 3 thằng trên thì tất cả các props đều đi vào ...custom
    ...custom
  }) => (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
    />
);


renderTextField.propTypes = {
    label : propTypes.string,
    input : propTypes.object,
    meta : propTypes.object

}

export default renderTextField;
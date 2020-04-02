// const isEmail = (email) => {
//   const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   if (email.match(regEx)) return true;
//   else return false;
// };

const validate = values => {
  const errors = {};
  const { password, email, confirmPassword } = values;
  if (!email) {
    errors.email = "Vui Lòng Nhập Email.";
  } else if (email.trim() && email.length < 5) {
    errors.email = "Vui Lòng Nhập Password Lớn Hơn 6 Kí Tự.";
  }

  if (!password) {
    errors.password = "Vui Lòng Nhập Password.";
  } else if (password.trim() && password.length < 6) {
    errors.password = "Vui Lòng Nhập Password Lớn Hơn 6 Kí Tự.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Vui Lòng Nhập ConfirmPassword.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Chưa Khớp Với Password";
  } else if (password.trim() && password.length < 6) {
    errors.password = "Vui Lòng Nhập Password Lớn Hơn 6 Kí Tự.";
  }
  return errors;
};

export default validate;

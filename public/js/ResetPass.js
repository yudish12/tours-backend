import axios from 'axios';
import { showAlert } from './alert';

export const resetHandler = async (password, passwordConfirm) => {
  const token = window.location.href.split('/')[4];
  console.log(token);
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/v1/users/resetPassword/${token}`,
      {
        password,
        passwordConfirm,
      }
    );
    console.log(res);
    if (res.data.message === 'Password changed sucessfully') {
      showAlert('success', 'Password Changed Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};

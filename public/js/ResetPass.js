import axios from 'axios';
import { showAlert } from './alert';

export const resetHandler = async (password, passwordConfirm) => {
  const token = window.location.href.split('/')[4];
  try {
    const res = await axios.patch(`/api/v1/users/resetPassword/${token}`, {
      password,
      passwordConfirm,
    });
    if (res.data.message === 'Password changed sucessfully') {
      showAlert('success', 'Password Changed Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.message);
  }
};

import { showAlert } from './alert';
import axios from 'axios';

export const forgotHandler = async (email) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/v1/users/forgotPassword`,
      {
        email,
      }
    );
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Email Sent successfully.Please check your inbox and spam section'
      );
      window.setTimeout(() => {
        location.reload(true);
      }, 3000);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.message);
  }
};

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
      showAlert('success', 'Email Sent successfully.Please check your inbox');
      //   window.setTimeout(() => {
      //     location.reload(true);
      //   }, 5000);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};

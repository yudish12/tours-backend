import axios from 'axios';
import { showAlert } from './alert';

export const update = async (data, type) => {
  try {
    const url = type === 'password' ? 'updateMypassword' : 'updateMe';
    const res = await axios.patch(
      `http://localhost:5000/api/v1/users/${url}`,
      data
    );
    console.log('xcas');

    if (
      res.data.message === 'success' ||
      res.data.message === 'password updated sucessfully'
    ) {
      showAlert('success', 'user info updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

import axios from 'axios';
import { showAlert } from './alert';

export const update = async (email, name) => {
  try {
    const res = await axios.patch(
      'http://localhost:5000/api/v1/users/updateMe',
      {
        email,
        name,
      }
    );
    console.log('xcas');

    if (res.data.message === 'success') {
      showAlert('success', 'user info updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 500);
    }
  } catch (error) {
    showAlert('error', error);
  }
};

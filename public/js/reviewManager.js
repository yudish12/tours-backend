import axios from 'axios';
import { showAlert } from './alert';

export const reviewManage = async (query, id) => {
  const url = `http://localhost:5000/api/v1/reviews/${query}/${id}`;
  try {
    const res = await axios.patch(url);
    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

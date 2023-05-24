import axios from 'axios';
import { showAlert } from './alert';

export const postReview = async (review, rating, tour) => {
  try {
    const res = await axios.post('/api/v1/reviews', {
      review,
      rating,
      tour,
    });

    if (res.data.status === 'Success') {
      showAlert('success', 'Review sent for approval to admin');
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message.split('{')[0]);
  }
};

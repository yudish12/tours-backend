import { showAlert } from './alert.js';
import axios from 'axios';

export const Login = async (email, password) => {
  try {
    const res = await axios.post('/api/v1/users/login/', {
      email: email,
      password: password,
    });

    if (res.data.message === 'Logged in successfully') {
      showAlert('success', 'Logged In Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout');
    if (res.data.message === 'Success') location.reload(true);
  } catch (error) {
    showAlert('error', 'error logging out! Please try again');
  }
};

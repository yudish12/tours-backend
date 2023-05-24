import axios from 'axios';
import { showAlert } from './alert';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios.post('/api/v1/users/signup', {
      email: email,
      password: password,
      name: name,
      passwordConfirm: passwordConfirm,
    });

    if (res.data.message === 'User signed up successfully') {
      showAlert(
        'success',
        'User signed up successfully check your emails spam folder'
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error);
  }
};

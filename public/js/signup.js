import axios from 'axios';
import { showAlert } from './alert';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/users/signup', {
      email: email,
      password: password,
      name: name,
      passwordConfirm: passwordConfirm,
    });

    console.log(res);

    if (res.data.message === 'User signed up successfully') {
      showAlert('success', 'User signed up successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error);
  }
};

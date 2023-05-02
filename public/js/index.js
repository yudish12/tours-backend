import { Login, logout } from './login.js';
import { displayMap } from './mapBox';
import '@babel/polyfill';
import { signUp } from './signup.js';
import { update } from './updateMe.js';
import { forgotHandler } from './forgotPassword.js';
import { resetHandler } from './ResetPass.js';
console.log('x');

const mapBox = document.getElementById('map');
const Loginform = document.querySelector('.loginForm');
const Signupform = document.querySelector('.signupForm');
const updateForm = document.querySelector('.form-user-data');
const passwordUpdateForm = document.querySelector('.form-user-settings');
const logoutBtn = document.querySelector('.nav__el--logout');
const forgotPasswordFormBtn = document.querySelector('.forgotPassword-form h3');
const closePopup = document.querySelector('.closePopup');
const forgotPasswordForm = document.querySelector('.forgotPasswordForm');
const newPasswordForm = document.querySelector('.NewPass');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.Locations);
  displayMap(locations);
}

if (Loginform) {
  Loginform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = Loginform.elements['email'].value;
    const passwrod = Loginform.elements['password'].value;
    Login(email, passwrod);
  });
}
console.log('x');

if (Signupform) {
  Signupform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = Signupform.elements['email'].value;
    const passwrod = Signupform.elements['password'].value;
    const passwrodConfirm = Signupform.elements['passwordConfirm'].value;
    const name = Signupform.elements['name'].value;
    signUp(name, email, passwrod, passwrodConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

console.log(updateForm);

if (updateForm) {
  console.log(document.getElementById('photo').files);
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('adasda');

    const form = new FormData();
    form.append('name', updateForm.elements['name'].value);
    form.append('email', updateForm.elements['email'].value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(document.getElementById('photo').files[0]);
    update(form, 'updateMe');
  });
}

if (passwordUpdateForm) {
  passwordUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordUpdateForm.elements['password-current'].value;
    const newPassword = passwordUpdateForm.elements['password'].value;
    const confirmNewPassword =
      passwordUpdateForm.elements['password-confirm'].value;

    update({ password, newPassword, confirmNewPassword }, 'password');
  });
}

if (forgotPasswordFormBtn) {
  forgotPasswordFormBtn.addEventListener('click', () => {
    const main = document.querySelector('.main');
    const loginContainer = document.querySelector('.login-form');
    const formForgot = document.querySelector('.forgotPasswordForm');
    formForgot.classList.remove('visible');
    console.log(main, loginContainer);
    main.classList.add('popup');
    loginContainer.classList.add('visible');
  });
}

if (closePopup) {
  closePopup.addEventListener('click', () => {
    const main = document.querySelector('.main');
    const loginContainer = document.querySelector('.login-form');
    const formForgot = document.querySelector('.forgotPasswordForm');
    formForgot.classList.add('visible');
    console.log(main, loginContainer);
    main.classList.remove('popup');
    loginContainer.classList.remove('visible');
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = forgotPasswordForm.elements['email--forgotPassword'].value;
    forgotHandler(email);
  });
}

if (newPasswordForm) {
  newPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = newPasswordForm.elements['password'].value;
    const passwordConfirm = newPasswordForm.elements['passwordConfirm'].value;
    resetHandler(password, passwordConfirm);
  });
}

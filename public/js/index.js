import { Login, logout } from './login.js';
import { displayMap } from './mapBox';
import '@babel/polyfill';
import { signUp } from './signup.js';

console.log('x');

const mapBox = document.getElementById('map');
const Loginform = document.querySelector('.loginForm');
const Signupform = document.querySelector('.signupForm');
const logoutBtn = document.querySelector('.nav__el--logout');

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
console.log(Signupform, 'x');

if (Signupform) {
  Signupform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = Loginform.elements['email'].value;
    const passwrod = Loginform.elements['password'].value;
    const passwrodConfirm = Loginform.elements['passwordConfirm'].value;
    const name = Loginform.elements['name'].value;
    signUp(name, email, passwrod, passwrodConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

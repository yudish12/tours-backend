import { Login, logout } from './login.js';
import { displayMap } from './mapBox';
import '@babel/polyfill';
import { signUp } from './signup.js';
import { update } from './updateMe.js';
import { forgotHandler } from './forgotPassword.js';
import { resetHandler } from './ResetPass.js';
import { bookTour } from './stripe.js';
import { postReview } from './postReview.js';
import { reviewManage } from './reviewManager.js';
import { showChart } from './getStats.js';

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
const bookBtn = document.getElementById('book-tour');
const stars = document.querySelectorAll('.icon');
const reviewForm = document.querySelector('.reviewForm');
const trash = document.querySelectorAll('.bin');
const check = document.querySelectorAll('.check');
const slides = document.querySelectorAll('.mySlides');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const chart = document.getElementById('chart');

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

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', updateForm.elements['name'].value);
    form.append('email', updateForm.elements['email'].value);
    form.append('photo', document.getElementById('photo').files[0]);
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

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (stars) {
  stars.forEach((star, ind1) => {
    star.addEventListener('click', () => {
      stars.forEach((star, ind2) => {
        ind1 >= ind2
          ? star.classList.add('active')
          : star.classList.remove('active');
      });
    });
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = reviewForm.elements['description'].value;
    const starIcons = document.querySelectorAll('.icon');
    let rating = 0;
    starIcons.forEach((star, ind) => {
      if (star.classList.contains('active')) {
        rating++;
      }
    });

    const tour = window.location.href.split('/')[4];
    postReview(review, rating, tour);
  });
}

if (check) {
  check.forEach((e) => {
    e.addEventListener('click', (el) => {
      el.preventDefault();
      const reviewId = e.dataset.Reviewid;
      reviewManage('approve', reviewId);
    });
  });
}

if (trash) {
  trash.forEach((e) => {
    e.addEventListener('click', (el) => {
      el.preventDefault();
      const reviewId = e.dataset.Reviewid;
      reviewManage('decline', reviewId);
    });
  });
}

if (slides) {
  var counter = 0;
  slides.forEach((e, i) => {
    e.style.left = `${i * 100}%`;
  });

  const slideImage = () => {
    slides.forEach((slide) => {
      const x = slide.style.left;
      slide.style.transform = `translateX(-${counter * 100}%)`;
    });
  };

  const goPrev = () => {
    counter = (counter + 4) % 5;
    slideImage();
  };

  const goNext = () => {
    counter = (counter + 1) % 5;
    slideImage();
  };

  next.addEventListener('click', () => {
    goNext();
  });

  prev.addEventListener('click', () => {
    goPrev();
  });
}

if (chart) {
  showChart(chart);
  // new Chart(document.getElementById('acquisitions'), {
  //   type: 'bar',
  //   data: {
  //     labels: data.map((row) => row.year),
  //     datasets: [
  //       {
  //         label: 'Acquisitions by year',
  //         data: data.map((row) => row.count),
  //       },
  //     ],
  //   },
  // });
}

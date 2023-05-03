import axios from 'axios';
import Stripe from 'stripe';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51N3LbPSIOa0kf3POmVs3FLaddGHu4Ia6pELDJPrJYip34bHeVeruFRqlU7bFPQ6FkcOX0qWtyHm9zn9kfWlS8lRZ00J6AUW4kr'
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://localhost:5000/api/v1/bookings/chechout-session/${tourId}`
    );
    console.log(session);
    window.open(session.data.session.url, '_blank');
  } catch (error) {
    showAlert('error', error);
  }
};

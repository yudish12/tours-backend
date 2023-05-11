import { showAlert } from './alert.js';
import axios from 'axios';
import Chart from 'chart.js/auto';

export const showChart = async (chart) => {
  try {
    const res = await axios.get(
      'http://localhost:5000/api/v1/tours/monthly-plan/2021'
    );
    const data = res.data.data;
    new Chart(chart, {
      type: 'bar',
      data: {
        labels: data.map((row) => row._id),
        datasets: [
          {
            label: 'Average Ratings Of 2023',
            data: data.map((row) => row.averageRating),
            backgroundColor: '#20bf6b',
          },
        ],
      },
    });
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

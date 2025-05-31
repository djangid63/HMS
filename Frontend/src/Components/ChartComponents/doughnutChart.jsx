import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const data = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Users by Color',
      data: [300, 500, 100],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(234, 179, 8, 1)',
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(234, 179, 8, 1)',
      ],
      borderWidth: 1,
      borderRadius: 10,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'User Distribution by Color',
    },
  },
};

export default function DoughnutChart() {
  return (
    <div className="">
      <Doughnut data={data} options={options} />
    </div>
  );
}

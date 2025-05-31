import axios from 'axios';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, Title,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import BASE_URL from '../../Utils/api';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function DoughnutChart() {

  const [bookingStatus, setBookingStatus] = useState({
    Approve: 0, Rejected: 0, Pending: 0
  })

  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    const fetchBooking = async () => {
      const resp = await axios.get(`${BASE_URL}/booking/getAll`, config)

      const approve = resp.data.data.filter((booking) => booking.status == 'Approved')
      const rejected = resp.data.data.filter((booking) => booking.status == 'Rejected')
      const pending = resp.data.data.filter((booking) => booking.status == 'Pending')

      if (resp.data.data)
        setBookingStatus({ Approve: approve.length, Rejected: rejected.length, Pending: pending.length })
      console.log("Doughnut", bookingStatus);
    }
    fetchBooking()
  }, [])

  const data = {
    labels: ['Rejected', 'Approved', 'Pending'],
    datasets: [
      {
        label: 'Users by Color',
        data: [bookingStatus?.Rejected, bookingStatus?.Approve, bookingStatus?.Pending],
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


  return (
    <div className="">
      <Doughnut data={data} options={options} />
    </div>
  );
}

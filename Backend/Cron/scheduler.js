const cron = require('node-cron');
const bookingModel = require('../Models/bookingModel')
const { getBooking } = require('../Controllers/bookingController')

const getAll = async () => {
  const booking = await getBooking()


  // console.log("filteredBooking", filteredBooking.length);
}
// getAll()
// const getAllBookings = async () => {
//   try {
//     const bookings = await bookingModel.find().populate('userId');
//     return bookings;

//     // const bookings = await bookingModel.aggregate([
//     //   {
//     //     $lookup: {
//     //       from: 'usersdatas',
//     //       localField: 'userId',
//     //       foreignField: '_id',
//     //       as: 'userDetails'
//     //     }
//     //   }
//     // ]);
//     // return bookings;
//   } catch (error) {
//     console.error('Error getting bookings:', error.message);
//   }
// };




const scheduleTasks = () => {
  cron.schedule('* * * * *', async () => {

    const users = await userbooking.find({
      status: 'pending',
      ischecking: { $ne: 'checkIn' }

    })

    const mapping = {}

    for (let i = 0; i < users.length; i++) {
      const id = users[i].userId.toString()

      mapping[id] = (mapping[id] || 0) + 1
    }

    for (let id in mapping) {
      if (mapping[id] >= 3) {
        console.log(`user ${id} has ${mapping[id]} failed`)
      }
    }

    console.log(' >>> Bookings >>>>', users);
    console.log('>>>>totalbookings>>>>', users.length)
  })
};

module.exports = scheduleTasks;

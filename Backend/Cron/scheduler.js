const cron = require('node-cron');
const bookingModel = require('../Models/bookingModel')
const { getBooking } = require('../Controllers/bookingController')
const userModel = require('../Models/userModel')

const scheduleTasks = () => {
  const task = cron.schedule('* * * * *', async () => {

    const users = await bookingModel.find({
      status: 'Pending' || 'Approved',
      ischecking: { $ne: 'Confirm' }
    })

    const mapping = {}

    for (let i = 0; i < users.length; i++) {
      const id = users[i].userId.toString()

      // mapping[id] = (mapping[id] || 0) + 1

      // Same as this
      if (mapping[id] === undefined) {
        mapping[id] = 1;
      } else {
        mapping[id] += 1;
      }
    }

    let filteredUser = []
    for (let id in mapping) {
      // Here id means the key
      if (mapping[id] >= 1) {
        filteredUser.push(id)
      }
    }

    async function disableUser(userId) {
      try {
        const disableUser = await userModel.findByIdAndUpdate(userId, { isDisabled: true }, { new: true })
        console.log('User disabled successfully', disableUser);
      } catch (error) {
        console.log("error disabling user", error);
      }
    }


    for (let i = 0; i < filteredUser.length; i++) {
      disableUser(filteredUser[i])
    }

  })
  task.stop()
};


module.exports = scheduleTasks;

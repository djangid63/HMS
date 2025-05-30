const couponModel = require('../Models/couponsModel')

exports.getCoupon = async (req, res) => {
  try {
    const getData = await couponModel.find()
    return res.status(201).json({ success: true, message: "Coupon fetched successful", data: getData })

  } catch (error) {
    console.log("Coupon fetch error", error);
    return res.status(404).json({ success: false, message: `${error}, failed to fetch coupon` })
  }
}

exports.addCoupon = async (req, res) => {
  try {
    const { code } = req.body

    const existingCoupon = await couponModel.find({ code })

    // if (existingCoupon) {
    //   return res.status(409).json({ success: false, message: `${error}, coupon already exist` })
    // }

    const couponData = new couponModel(req.body)
    const saveData = await couponData.save()
    return res.status(201).json({ success: true, message: "Coupon Created Successfully", data: saveData })

  } catch (error) {
    console.log("Coupon creation error", error);
    return res.status(404).json({ success: false, message: `${error}, failed to add coupon` })
  }
}

exports.updateCoupon = async (req, res) => {
  try {
    const id = req.params.id; // Use URL parameter instead of body
    const updateData = await couponModel.findByIdAndUpdate(id, req.body, { new: true })
    return res.status(200).json({ success: true, message: "Coupon updated Successfully", data: updateData })

  } catch (error) {
    console.log("Coupon updation error", error);
    return res.status(404).json({ success: false, message: `${error}, failed to update coupon` })
  }
}

exports.disableCoupon = async (req, res) => {
  try {
    const id = req.params.id; // Use URL parameter instead of body
    const findCoupon = await couponModel.findById(id)
    const deleteData = await couponModel.findByIdAndUpdate(id, { isDisable: !findCoupon.isDisable })
    return res.status(201).json({ success: true, message: "Coupon disabled successful", data: deleteData })

  } catch (error) {
    console.log("Coupon delete error", error);
    return res.status(404).json({ success: false, message: `${error}, failed to disable coupon` })
  }
}

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    const deleteData = await couponModel.findByIdAndDelete(id)
    return res.status(201).json({ success: true, message: "Coupon disabled successful", data: deleteData })

  } catch (error) {
    console.log("Coupon delete error", error);
    return res.status(404).json({ success: false, message: `${error}, failed to disable coupon` })
  }
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../Utils/api';

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    validFrom: '',
    validTill: '',
    minBookingAmount: ''
  });

  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchCoupons = async () => {
    const res = await axios.get(`${BASE_URL}/coupon/getAll`, config);
    console.log(res.data);
    setCoupons(res.data.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${BASE_URL}/coupon/addCoupon`, form, config);
    setForm({ code: '', discountType: 'percentage', discountValue: '', validFrom: '', validTill: '', minBookingAmount: '' });
    fetchCoupons();
  };

  const handleDelete = async (id) => {
    // await axios.delete(`/api/coupons/${id}`);
    // fetchCoupons();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Coupon Manager</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="code" value={form.code} onChange={handleChange} placeholder="Code" className="border p-2 rounded" required />
        <select name="discountType" value={form.discountType} onChange={handleChange} className="border p-2 rounded">
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
        <input name="discountValue" value={form.discountValue} onChange={handleChange} type="number" placeholder="Discount Value" className="border p-2 rounded" required />
        <input name="validFrom" value={form.validFrom} onChange={handleChange} type="date" className="border p-2 rounded" required />
        <input name="validTill" value={form.validTill} onChange={handleChange} type="date" className="border p-2 rounded" required />
        <input name="minBookingAmount" value={form.minBookingAmount} onChange={handleChange} type="number" placeholder="Min Booking Amount" className="border p-2 rounded" />
        <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded">Add Coupon</button>
      </form>

      <div className="space-y-4">
        {coupons && coupons.map(coupon => (
          <div key={coupon._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{coupon.code} ({coupon.discountType} - {coupon.discountValue})</p>
              <p className="text-sm text-gray-600">Valid: {coupon.validFrom.slice(0, 10)} to {coupon.validTill.slice(0, 10)}</p>
            </div>
            <button onClick={() => handleDelete(coupon._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

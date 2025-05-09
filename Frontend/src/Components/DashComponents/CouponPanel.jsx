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
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/coupon/getAll`, config);
      console.log(res.data);
      setCoupons(res.data.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      alert('Failed to fetch coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.patch(`${BASE_URL}/coupon/updateCoupon`, { ...form, id: editId }, config);
        alert('Coupon updated successfully!');
      } else {
        await axios.post(`${BASE_URL}/coupon/addCoupon`, form, config);
        alert('Coupon added successfully!');
      }

      setForm({ code: '', discountType: 'percentage', discountValue: '', validFrom: '', validTill: '', minBookingAmount: '' });
      setIsEditing(false);
      setEditId(null);
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(isEditing ? 'Failed to update coupon' : 'Failed to add coupon');
    }
  };

  const handleEdit = (coupon) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      validFrom: formatDate(coupon.validFrom),
      validTill: formatDate(coupon.validTill),
      minBookingAmount: coupon.minBookingAmount || ''
    });

    setIsEditing(true);
    setEditId(coupon._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`${BASE_URL}/coupon/deleteCoupon`, {
          headers: config.headers,
          data: { id }
        });
        alert('Coupon deleted successfully!');
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Failed to delete coupon');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.delete(`${BASE_URL}/coupon/disableCoupon`, {
        headers: config.headers,
        data: { id }
      });
      alert(`Coupon ${currentStatus ? 'enabled' : 'disabled'} successfully!`);
      fetchCoupons();
    } catch (error) {
      console.error('Error changing coupon status:', error);
      alert('Failed to change coupon status');
    }
  };

  const cancelEdit = () => {
    setForm({ code: '', discountType: 'percentage', discountValue: '', validFrom: '', validTill: '', minBookingAmount: '' });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Coupon Manager</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded">
        <h2 className="col-span-1 md:col-span-2 text-lg font-semibold">{isEditing ? 'Edit Coupon' : 'Add New Coupon'}</h2>

        <input name="code" value={form.code} onChange={handleChange} placeholder="Code" className="border p-2 rounded" required />
        <select name="discountType" value={form.discountType} onChange={handleChange} className="border p-2 rounded">
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
        <input name="discountValue" value={form.discountValue} onChange={handleChange} type="number" placeholder="Discount Value" className="border p-2 rounded" required />
        <input name="validFrom" value={form.validFrom} onChange={handleChange} type="date" className="border p-2 rounded" required />
        <input name="validTill" value={form.validTill} onChange={handleChange} type="date" className="border p-2 rounded" required />
        <input name="minBookingAmount" value={form.minBookingAmount} onChange={handleChange} type="number" placeholder="Min Booking Amount" className="border p-2 rounded" />

        <div className="col-span-1 md:col-span-2 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            {isEditing ? 'Update Coupon' : 'Add Coupon'}
          </button>
          {isEditing && (
            <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white py-2 px-4 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">All Coupons</h2>
        <div className="space-y-4">
          {coupons && coupons.length > 0 ? (
            coupons.map(coupon => (
              <div key={coupon._id} className="border p-4 rounded flex flex-col md:flex-row justify-between">
                <div className="mb-2 md:mb-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{coupon.code}</p>
                    <span className={`px-2 py-1 text-xs rounded ${coupon.isDisable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {coupon.isDisable ? 'Disabled' : 'Active'}
                    </span>
                  </div>
                  <p className="text-sm">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                  </p>
                  <p className="text-sm text-gray-600">Valid: {new Date(coupon.validFrom).toLocaleDateString()} to {new Date(coupon.validTill).toLocaleDateString()}</p>
                  {coupon.minBookingAmount > 0 && <p className="text-sm text-gray-600">Min. Booking: ₹{coupon.minBookingAmount}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleStatus(coupon._id, coupon.isDisable)} className={`${coupon.isDisable ? 'bg-green-500' : 'bg-yellow-500'} text-white px-3 py-1 rounded`}>
                    {coupon.isDisable ? 'Enable' : 'Disable'}
                  </button>
                  <button onClick={() => handleEdit(coupon)} className="bg-blue-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(coupon._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No coupons found. Add your first coupon above!</p>
          )}
        </div>
      </div>
    </div>
  );
}

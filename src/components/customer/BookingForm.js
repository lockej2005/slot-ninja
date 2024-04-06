import React, { useState } from 'react';
import './BookingForm.scss';  // Ensure this path is correct.

function BookingForm() {
    const [bookingDetails, setBookingDetails] = useState({
        service: '',
        date: '',
        time: '',
        notes: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBookingDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Booking submission logic here
        console.log('Booking Details:', bookingDetails);
    };

    return (
        <div className="booking-form-container">
            <h2 className="form-title">Book Your Appointment</h2>
            <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                    <label htmlFor="service">Service</label>
                    <select
                        id="service"
                        name="service"
                        value={bookingDetails.service}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Please select</option>
                        <option value="service1">Service 1</option>
                        <option value="service2">Service 2</option>
                        {/* Additional services as needed */}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={bookingDetails.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={bookingDetails.time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={bookingDetails.notes}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="submit-btn">Submit Booking</button>
            </form>
        </div>
    );
}

export default BookingForm;

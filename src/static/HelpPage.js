import React from 'react';
import './HelpPage.scss'

function HelpPage() {
  return (
    <div className="help-page-container">
      <h1>Help & Support</h1>
      
      <section className="contact-details">
        <h2>Contact Us</h2>
        <p>If you need help or support, please reach out to us:</p>
        <ul>
          <li>Email: josh.locke@outlook.com</li>
          <li>Phone: +61 478 116 053</li>
        </ul>
      </section>
      
      <section className="faq-articles">
        <h2>Frequently Asked Questions</h2>
        <article>
          <h3>How to Book an Appointment?</h3>
          <p>Booking an appointment is simple: [brief explanation on how to book an appointment].</p>
        </article>
        <article>
          <h3>Managing Your Bookings</h3>
          <p>Need to change or cancel a booking? [instructions or policies on booking management].</p>
        </article>
        <article>
          <h3>Payment and Refunds</h3>
          <p>Find out about our payment methods and refund policies [details on payment and refunds].</p>
        </article>
      </section>
    </div>
  );
}

export default HelpPage;

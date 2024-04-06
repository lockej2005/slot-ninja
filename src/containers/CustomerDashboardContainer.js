import React from 'react';
import CustomerDashboard from '../components/customer/CustomerDashboard';
import './CustomerDashboardContainer.scss'; // Ensure this path is correct.

function CustomerDashboardContainer() {
  return (
    <div className="customer-dashboard-container">
      <CustomerDashboard />
    </div>
  );
}

export default CustomerDashboardContainer;

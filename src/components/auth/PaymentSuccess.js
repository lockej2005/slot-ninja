import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../App'; // Make sure this import path is correct

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Properly destructure setCurrentUser from the context

  useEffect(() => {
    async function verifyAndFetchUserDetails() {
      const userId = new URLSearchParams(location.search).get('user_id');
      const sessionId = new URLSearchParams(location.search).get('session_id');

      if (!userId || !sessionId) {
        console.error('Missing user ID or session ID');
        navigate('/payment-failed');
        return;
      }

      console.log("Verifying payment...");
      try {
        const response = await fetch(`http://localhost:3000/verify-payment?user_id=${userId}&session_id=${sessionId}`);
        if (!response.ok) {
          console.error('Payment verification request failed');
          navigate('/payment-failed');
          return;
        }

        const paymentData = await response.json();
        if (paymentData.paymentVerified) {
          const { data, error } = await supabase
            .from('users')
            .select('email')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Failed to fetch user data:', error.message);
            navigate('/payment-failed');
            return;
          }

          // Set the current user in context
          setCurrentUser({
            id: userId,
            email: data.email // Include any other user details necessary for your application
          });

          navigate('/business/dashboard');
        } else {
          console.error('Payment verification failed');
          navigate('/payment-failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        navigate('/payment-failed');
      }
    }

    verifyAndFetchUserDetails();
  }, [location.search, navigate, setCurrentUser]);

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you for your payment. Redirecting to your dashboard...</p>
    </div>
  );
}

export default PaymentSuccess;

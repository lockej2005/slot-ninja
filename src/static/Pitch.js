import React from 'react';
import './Pitch.scss';

function Pitch() {
    return (
        <div className="pitch-container">
            <h1 className="pitch-title">Discover Our Product</h1>
            <div className="pitch-section">
                <h2>What is Our Product?</h2>
                <p>
                    Our Product is a state-of-the-art solution designed to streamline and enhance your daily activities,
                    whether personal or professional. By integrating cutting-edge technology, Our Product ensures that
                    you stay connected and productive with minimal effort.
                </p>
            </div>
            <div className="pitch-section">
                <h2>How Does It Work?</h2>
                <p>
                    Our Product works by combining AI-driven technology with an intuitive user interface that adapts to
                    your individual needs. Here’s how you can start using Our Product today:
                </p>
                <ul>
                    <li><strong>Step 1:</strong> Sign up and create your personal profile.</li>
                    <li><strong>Step 2:</strong> Customize your preferences and settings to suit your needs.</li>
                    <li><strong>Step 3:</strong> Start interacting with the features and tools offered, benefiting from
                        customized insights and recommendations.
                    </li>
                </ul>
            </div>
            <div className="pitch-section">
                <h2>Benefits of Using Our Product</h2>
                <p>
                    With Our Product, you can expect to experience a range of benefits that include but are not limited
                    to:
                </p>
                <ul>
                    <li>Increased productivity through automation and optimized processes.</li>
                    <li>Enhanced connectivity with your peers or customers.</li>
                    <li>Insights derived from data to help make informed decisions.</li>
                </ul>
            </div>
            <div className="pitch-section">
                <h2>Get Started Today!</h2>
                <p>Join the thousands of users who have transformed their daily routines with Our Product. Sign up now
                    and take the first step towards a smarter, more efficient lifestyle.</p>
            </div>
        </div>
    );
}

export default Pitch;

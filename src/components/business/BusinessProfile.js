import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App'; // Adjust this path if your AuthContext is located elsewhere
import { supabase } from '../../supabaseClient'; // Adjust the path as necessary
import './BusinessProfile.scss';

function BusinessProfile() {
    const [profile, setProfile] = useState({
        businessName: '',
        description: '',
        contactEmail: '',
        phoneNumber: ''
    });
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!currentUser) return;

            const data = await supabase
                .from('users')
                .select('business_name, description, email, phone')
                .eq('id', currentUser.id)
                .single();

            if (data) {
                console.log(data)
                setProfile({
                    businessName: data.data.business_name || '',
                    description: data.data.description || '',
                    contactEmail: data.data.email || '',
                    phoneNumber: data.data.phone || ''
                });
            } else {
                console.error('Error fetching profile data:');
            }
        };

        fetchProfileData();
    }, [currentUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        const { error } = await supabase
            .from('users')
            .update({ 
                business_name: profile.businessName,
                description: profile.description,
                email: profile.contactEmail,
                phone: profile.phoneNumber
            })
            .eq('id', currentUser.id);

        if (error) {
            console.error('Error updating profile data:', error.message);
        } else {
            alert('Profile updated successfully');
        }
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">Business Profile</h2>
            <form className="profile-form" onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="businessName">Business Name</label>
                    <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={profile.businessName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={profile.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email</label>
                    <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={profile.contactEmail}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <button type="button" className="profile-save-btn" onClick={handleSaveChanges}>Save Changes</button>
            </form>
        </div>
    );
}

export default BusinessProfile;

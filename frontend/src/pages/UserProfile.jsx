import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const { user, setUser, axios } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
        }
    });

    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zipcode: user.address?.zipcode || '',
                    country: user.address?.country || ''
                }
            });
            setPreviewImage(user.profilePicture);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const uploadProfilePicture = async () => {
        if (!selectedFile) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('profilePicture', selectedFile);

            const { data } = await axios.post('/api/user/upload-profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                setUser(data.user);
                setSelectedFile(null);
                toast.success('Profile picture updated successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            toast.error(error.response?.data?.message || 'Failed to upload profile picture');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data for submission
            const submitData = {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
            };

            const { data } = await axios.put('/api/user/update-profile', submitData);

            if (data.success) {
                setUser(data.user);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="mt-16 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-blue-100 mt-2">Manage your account information and preferences</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Picture Section */}
                            <div className="lg:col-span-1">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mx-auto">
                                            <img
                                                src={previewImage || assets.profile_icon}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    
                                    {selectedFile && isEditing && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm text-gray-600">{selectedFile.name}</p>
                                            <button
                                                onClick={uploadProfilePicture}
                                                disabled={uploadingImage}
                                                className="btn-gradient-primary px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                            >
                                                {uploadingImage ? 'Uploading...' : 'Upload Picture'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Details Section */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Gender
                                                </label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.street"
                                                    value={formData.address.street}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.city"
                                                    value={formData.address.city}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State/Province
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.state"
                                                    value={formData.address.state}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ZIP/Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.zipcode"
                                                    value={formData.address.zipcode}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.country"
                                                    value={formData.address.country}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="btn-gradient-primary px-6 py-2 rounded-md font-medium"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        // Reset form data to original values
                                                        setFormData({
                                                            name: user.name || '',
                                                            phone: user.phone || '',
                                                            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                                                            gender: user.gender || '',
                                                            address: {
                                                                street: user.address?.street || '',
                                                                city: user.address?.city || '',
                                                                state: user.address?.state || '',
                                                                zipcode: user.address?.zipcode || '',
                                                                country: user.address?.country || ''
                                                            }
                                                        });
                                                        setSelectedFile(null);
                                                        setPreviewImage(user.profilePicture);
                                                    }}
                                                    className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="btn-gradient-primary px-6 py-2 rounded-md font-medium disabled:opacity-50"
                                                >
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 
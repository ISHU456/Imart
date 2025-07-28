import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { star_icon, star_dull_icon } from '../assets/assets';
import toast from 'react-hot-toast';

const RatingSystem = ({ productId, productRatings, onRatingUpdate }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canRate, setCanRate] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [loadingRatingCheck, setLoadingRatingCheck] = useState(true);
    const { user, axios } = useAppContext();

    useEffect(() => {
        if (user && productRatings?.ratings) {
            const existingRating = productRatings.ratings.find(r => r.user._id === user._id);
            if (existingRating) {
                setUserRating(existingRating);
                setRating(existingRating.rating);
                setReview(existingRating.review);
            }
        }
    }, [user, productRatings]);

    // Check if user can rate this product
    useEffect(() => {
        const checkCanRate = async () => {
            if (!user || !productId) {
                setLoadingRatingCheck(false);
                return;
            }

            try {
                const { data } = await axios.get(`/api/product/can-rate/${productId}`);
                if (data.success) {
                    setCanRate(data.canRate);
                    setHasRated(data.hasRated);
                    
                    // If user has already rated, populate the form
                    if (data.existingRating) {
                        setRating(data.existingRating.rating);
                        setReview(data.existingRating.review);
                    }
                }
            } catch (error) {
                console.error('Error checking rating eligibility:', error);
                setCanRate(false);
            } finally {
                setLoadingRatingCheck(false);
            }
        };

        checkCanRate();
    }, [user, productId, axios]);

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to rate this product');
            return;
        }
        if (!canRate) {
            toast.error('You can only rate products that have been delivered to you');
            return;
        }
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await axios.post('/api/product/rate', {
                productId,
                rating,
                review
            });

            if (data.success) {
                toast.success(hasRated ? 'Rating updated successfully!' : 'Rating added successfully!');
                setHasRated(true);
                if (onRatingUpdate) {
                    onRatingUpdate(data.product);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit rating';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (ratingValue, interactive = false) => {
        return Array(5).fill(0).map((_, index) => {
            const starValue = index + 1;
            const isFilled = interactive ? (hoverRating || rating) >= starValue : ratingValue >= starValue;
            
            return (
                <img
                    key={index}
                    src={isFilled ? star_icon : star_dull_icon}
                    alt="star"
                    className={`w-5 h-5 cursor-pointer ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
                    onClick={interactive ? () => setRating(starValue) : undefined}
                    onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
                    onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                />
            );
        });
    };

    return (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h3>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                        {productRatings?.averageRating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="flex justify-center mt-1">
                        {renderStars(productRatings?.averageRating || 0)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        {productRatings?.totalRatings || 0} reviews
                    </div>
                </div>
            </div>

            {/* Add Rating Form */}
            {user && !loadingRatingCheck && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    {canRate ? (
                        <>
                            <h4 className="font-medium text-gray-800 mb-3">
                                {hasRated ? 'Update Your Rating' : 'Write a Review'}
                            </h4>
                            <form onSubmit={handleSubmitRating}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex gap-1">
                                        {renderStars(rating, true)}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Review (Optional)
                                    </label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Share your experience with this product..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-gradient-primary px-6 py-2 rounded-md font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : (hasRated ? 'Update Review' : 'Submit Review')}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="text-gray-500 mb-2">
                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-2">Rate After Delivery</h4>
                            <p className="text-gray-600 text-sm">
                                You can only rate this product after it has been delivered to you.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {user && loadingRatingCheck && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-600 text-sm mt-2">Checking rating eligibility...</p>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-800">All Reviews</h4>
                {productRatings?.ratings && productRatings.ratings.length > 0 ? (
                    productRatings.ratings.map((rating, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {rating.user.profilePicture ? (
                                        <img 
                                            src={rating.user.profilePicture} 
                                            alt={rating.user.name || 'User'} 
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {rating.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <span className="font-medium text-gray-800">
                                        {rating.user.name || 'Anonymous'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {renderStars(rating.rating)}
                                </div>
                            </div>
                            {rating.review && (
                                <p className="text-gray-600 text-sm">{rating.review}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                                {new Date(rating.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
                )}
            </div>
        </div>
    );
};

export default RatingSystem; 
import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import FadeInOnScroll from './FadeInOnScroll';

const ProductCard = ({ product }) => {
  const { addToCart, updateCartItems, removeFromCart, cartItems, navigate } = useAppContext();
  
  // Check if product is clothing
  const isClothingProduct = product?.category === 'MEN' || product?.category === 'Women' || product?.category === 'Kids';
  
  // Check if product is in cart (for non-clothing products)
  const isInCart = cartItems[product._id];
  
  // For clothing products, check if any size variant is in cart
  const getClothingCartCount = () => {
    if (!isClothingProduct) return 0;
    let total = 0;
    for (const key in cartItems) {
      if (key.startsWith(product._id + '-')) {
        total += cartItems[key];
      }
    }
    return total;
  };
  
  const clothingCartCount = getClothingCartCount();

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <img
        key={index}
        src={index < rating ? assets.star_icon : assets.star_dull_icon}
        alt="star"
        className="w-3 h-3"
      />
    ));
  };

  return product && (
    <FadeInOnScroll>
      <div className="bg-white p-3 sm:p-4 rounded-md transition duration-300 hover:shadow-xl min-w-[200px] sm:min-w-[250px] max-w-[280px] sm:max-w-[300px] flex-1">
        {/* Image */}
        <div
          onClick={() => {
            navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center justify-center"
        >
          <img
            className="transition duration-300 object-cover h-48 sm:h-60 w-full rounded-md hover:shadow-md"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        {/* Info */}
        <div className="text-gray-800/60 text-base sm:text-lg mt-3 sm:mt-4">
          <p className="text-xs sm:text-sm text-gray-500">{product.category}</p>
          <p className="text-gray-800 font-semibold text-base sm:text-lg truncate">{product.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {renderStars(product.averageRating || 0)}
            <span className="text-xs text-gray-500 ml-1">
              ({product.totalRatings || 0})
            </span>
          </div>

          {/* Price + Button layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-3">
            {/* Price */}
            <p className="text-base sm:text-xl font-medium text-primary">
              ₹{product.offerPrice}{' '}
              <span className="text-gray-500/60 text-xs sm:text-sm line-through">₹{product.price}</span>
            </p>

            {/* Buttons */}
            {isClothingProduct ? (
              // For clothing products, always show "Add" button to go to product details for size selection
              <button
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="text-white bg-primary rounded-2xl px-4 sm:px-6 py-2 w-full sm:w-auto text-sm font-medium hover:shadow-md transition"
              >
                {clothingCartCount > 0 ? `${clothingCartCount} in Cart` : 'Add'}
              </button>
            ) : (
              // For non-clothing products, use the original logic
              !isInCart ? (
                <button
                  onClick={() => addToCart(product._id)}
                  className="text-white bg-primary rounded-2xl px-4 sm:px-6 py-2 w-full sm:w-auto text-sm font-medium hover:shadow-md transition"
                >
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-between w-full sm:w-auto bg-primary/25 rounded-2xl px-3 py-1 text-primary font-semibold hover:shadow-md transition">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-2 sm:px-3 text-lg hover:bg-primary/10 rounded"
                  >
                    -
                  </button>
                  <span className="px-1 sm:px-2">{cartItems[product._id]}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="px-2 sm:px-3 text-lg hover:bg-primary/10 rounded"
                  >
                    +
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </FadeInOnScroll>
  );
};

export default ProductCard;

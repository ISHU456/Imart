import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  const ecommerceFeatures = [
    {
      icon: assets.shipping_icon, // Update to your actual icon path
      title: 'Free Shipping',
      description: 'On all orders above ₹499 across India.',
    },
    {
      icon: assets.return_icon,
      title: 'Trusted products',
      description: 'Direct from store to your address',
    },
    {
      icon: assets.support_icon,
      title: '24/7 Customer Support',
      description: 'We’re here to help you anytime, anywhere.',
    },
    {
      icon: assets.secure_icon,
      title: 'Cash On delivery Payment',
      description: 'We support cash on delivery system',
    },
  ];

  return (
    <div className="relative w-full">
      {/* Background Image */}
      <img src={assets.bottom_banner_image} alt="ecommerce banner" className="w-full hidden md:block object-cover" />
      <img src={assets.bottom_banner_image_sm} alt="ecommerce banner small" className="w-full md:hidden object-cover" />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-start justify-center md:pl-24 px-6 py-16">
        <div className="bg-white/90 backdrop-blur-lg px-6 py-8 rounded-xl max-w-xl shadow-lg text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 leading-tight">
            Shop Smarter, Live Better
          </h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Discover premium quality products, unbeatable prices, and a seamless shopping experience all in one place.
          </p>
          {ecommerceFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 mt-4">

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;

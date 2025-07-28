import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className="mt-8 sm:mt-16 w-full">
      <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 mb-4 text-center sm:text-left px-4 sm:px-6 lg:px-8">Best Seller</p>

      <div className="bg-blue-100 px-3 sm:px-4 py-6 sm:py-10 rounded-lg mx-4 sm:mx-6 lg:mx-8">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
          {products
            .filter((product) => product.inStock)
            .slice(0, 16)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;

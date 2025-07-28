import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from './ProductCard';

const WomenRow = () => {
  const { products, navigate } = useAppContext();

  const womenProducts = products
    .filter(product => product.category?.toLowerCase() === 'women' && product.inStock)
    .slice(0, 5);

  return (
    <div className="mt-8 sm:mt-16 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 text-center sm:text-left">Women's Collection</h2>
        <button
          onClick={() => {
            navigate('/products/women');
            scrollTo(0, 0);
          }}
          className="text-sm md:text-base text-primary hover:underline transition"
        >
          See More &rarr;
        </button>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start px-4 sm:px-6 lg:px-8">
        {womenProducts.length > 0 ? (
          womenProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No women's products available.</p>
        )}
      </div>
    </div>
  );
};

export default WomenRow;

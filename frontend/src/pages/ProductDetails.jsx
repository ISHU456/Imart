import React, {useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets, categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import RatingSystem from "../components/RatingSystem";

const ProductDetails = () => {
    const {products,navigate,addToCart,axios} = useAppContext();
    const {id} = useParams();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [productRatings, setProductRatings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const product = products.find((item)=>item._id == id);
    const [thumbnail, setThumbnail] = useState();

    // Check if product is clothing
    const isClothingProduct = product?.category === 'MEN' || product?.category === 'Women' || product?.category === 'Kids';

    useEffect(()=>{
        if(products.length>0){
            let productCopy = products.slice();
            productCopy = productCopy.filter((item)=>product.category === item.category);
            setRelatedProducts(productCopy.slice(0,5));
        }
    },[products])

    useEffect(()=>{
        setThumbnail(product?.image[0]?product.image[0]:null)
    },[product])

    useEffect(() => {
        const fetchRatings = async () => {
            if (product?._id) {
                try {
                    const { data } = await axios.get(`/api/product/ratings/${product._id}`);
                    if (data.success) {
                        setProductRatings(data);
                    }
                } catch (error) {
                    console.error('Error fetching ratings:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRatings();
    }, [product?._id, axios]);

    const handleRatingUpdate = (updatedProduct) => {
        setProductRatings({
            ratings: updatedProduct.ratings,
            averageRating: updatedProduct.averageRating,
            totalRatings: updatedProduct.totalRatings
        });
    };

    return product && (
        <div className="mt-16">
            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>
                
                <div className="text-sm w-full md:w-1/2">
                    <p>
                        <Link to={'/'}>Home</Link> /
                        <Link to={'/products'}> Products</Link> /
                        <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                        <Link> {product.name}</Link>
                    </p>
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < (productRatings?.averageRating || 0) ? assets.star_icon : assets.star_dull_icon} className="md:w-4 w-3.5"/>
                        ))}
                        <p className="text-base ml-2">({productRatings?.totalRatings || 0})</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: ₹ {product.price}</p>
                        <p className="text-2xl font-medium">MRP: ₹ {product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    {product.detailedDescription && (
                        <div className="mt-6">
                            <p className="text-base font-medium">Detailed Description</p>
                            <p className="text-gray-600 mt-2 leading-relaxed">
                                {product.detailedDescription}
                            </p>
                        </div>
                    )}

                    {/* Size Selection for Clothing */}
                    {isClothingProduct && product.sizes && product.sizes.length > 0 && (
                        <div className="mt-6">
                            <p className="text-base font-medium mb-3">Select Size</p>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded border transition-colors ${
                                            selectedSize === size
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {selectedSize && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Selected Size: {selectedSize}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button 
                            onClick={()=>{
                                if (isClothingProduct && !selectedSize) {
                                    alert('Please select a size before adding to cart');
                                    return;
                                }
                                addToCart(product._id, selectedSize);
                            }} 
                            className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded-lg" 
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={()=>{
                                if (isClothingProduct && !selectedSize) {
                                    alert('Please select a size before adding to cart');
                                    return;
                                }
                                addToCart(product._id, selectedSize);
                                navigate('/cart');
                            }} 
                            className="w-full py-3.5 cursor-pointer font-medium btn-gradient-primary rounded-lg" 
                        >
                            Add to Cart & Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* Rating System */}
            {!loading && (
                <RatingSystem 
                    productId={product._id}
                    productRatings={productRatings}
                    onRatingUpdate={handleRatingUpdate}
                />
            )}

            <div className="flex flex-col items-center mt-20">
                    <div className="flex flex-col items-center w-max">
                        <p className="text-3xl font-medium">Related Products</p>
                        <div className="w-20 h-0.5 bg-primary rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                        {relatedProducts.filter((product)=>product.inStock).map((product,index)=>(
                            <ProductCard key={index} product={product}/>
                        ))}
                    </div>
                    <button onClick={()=>{navigate('/products');scrollTo(0,0)}} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded-lg text-primary hover:bg-primary/10 transition">See More</button>

            </div>
        </div>
    );
};

export default ProductDetails;
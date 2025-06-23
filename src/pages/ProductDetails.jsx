import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, addDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Carousel } from 'react-responsive-carousel';
import toast from 'react-hot-toast';
import { FaHeart, FaShareAlt, FaShoppingCart, FaStar } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PlaceOrder from '../components/PlaceOrder';

const ProductDetail = () => {
  const { id } = useParams();
  const type = 'products';
  const [item, setItem] = useState(null);
  const [liked, setLiked] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchItem = async () => {
      const ref = doc(db, type, id);
      const snap = await getDoc(ref);
      if (snap.exists()) setItem(snap.data());
    };

    const fetchReviews = async () => {
      setLoadingReviews(true);
      const snap = await getDocs(collection(db, 'products', id, 'reviews'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
      setLoadingReviews(false);
    };

    fetchItem();
    fetchReviews();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setInCart(cart.some(p => p.id === id));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    const checkLike = async () => {
      const ref = doc(db, 'users', user.uid, 'likedItems', id);
      const snap = await getDoc(ref);
      setLiked(snap.exists());
    };
    checkLike();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return toast.error("Login to like items.");
    const ref = doc(db, 'users', user.uid, 'likedItems', id);
    if (liked) {
      await deleteDoc(ref);
      toast.success('Removed from liked items');
    } else {
      await setDoc(ref, { ...item, id, type });
      toast.success('Added to liked items');
    }
    setLiked(!liked);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...item, id });
    localStorage.setItem('cart', JSON.stringify(cart));
    setInCart(true);
    toast.success("Added to cart");
  };

  const handleSubmitReview = async () => {
    if (!user) return toast.error("Login to leave a review.");
    if (rating === 0 || reviewText.trim().length < 3) {
      toast.error("Please write a review and select rating.");
      return;
    }

    const ref = collection(db, 'products', id, 'reviews');
    const existing = reviews.find(r => r.uid === user.uid);

    if (existing) {
      const docRef = doc(db, 'products', id, 'reviews', existing.id);
      await updateDoc(docRef, {
        text: reviewText,
        rating,
        updatedAt: serverTimestamp()
      });
      toast.success("Review updated.");
    } else {
      await addDoc(ref, {
        text: reviewText,
        rating,
        name: user.displayName || "Anonymous",
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      toast.success("Review added.");
    }

    setReviewText('');
    setRating(0);

    setLoadingReviews(true);
    const snap = await getDocs(ref);
    setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoadingReviews(false);
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteDoc(doc(db, 'products', id, 'reviews', reviewId));
    toast.success("Review deleted");
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleShare = () => {
    navigator.share?.({
      title: item?.name,
      text: item?.description,
      url: window.location.href
    });
  };

  if (!item) {
    return (
      <div className="flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto dark:bg-gray-900 dark:text-white">
      <div className="grid md:grid-cols-2 gap-10">
        <Carousel showArrows autoPlay infiniteLoop className="rounded shadow">
          <div><img src={item.image} alt="Main" /></div>
          {item.images?.map((url, i) => (
            <div key={i}><img src={url} alt={`Slide ${i + 1}`} /></div>
          ))}
        </Carousel>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{item.name}</h1>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">₹{item.price}</p>
            {item.discount && (
              <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1 rounded text-sm font-semibold">
                {item.discount}% OFF
              </span>
            )}
            {item.quantity === 0 && (
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded text-sm font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded ${liked
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'} hover:opacity-90`}
            >
              <FaHeart /> {liked ? 'Liked' : 'Like'}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FaShareAlt /> Share
            </button>

            {inCart ? (
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
              >
                <FaShoppingCart /> Go to Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            )}
          </div>

          <div className="mt-4">
            {user ? (
              <PlaceOrder
                productId={id}
                productName={item.name}
                price={item.price}
                type="buy"
              />
            ) : (
              <button
                onClick={() => toast.error("Please login to purchase.")}
                className="w-full py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-700"
              >
                Login to Purchase
              </button>
            )}
          </div>

          <div className="pt-6 border-t dark:border-gray-700 mt-6">
            <h2 className="text-lg font-semibold mb-2">Product Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        </div>
      </div>

      {/* ✍️ Leave a Review */}
      {user && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(num => (
              <FaStar
                key={num}
                onClick={() => setRating(num)}
                className={`cursor-pointer ${rating >= num ? 'text-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <textarea
            className="w-full border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded p-2"
            rows={3}
            placeholder="Share your thoughts..."
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
          />
          <button
            onClick={handleSubmitReview}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* ⭐ Reviews */}
      <div className="mt-12 border-t pt-8 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">⭐ Customer Reviews</h2>

        {loadingReviews ? (
          <p className="text-gray-400 dark:text-gray-500 italic">⏳ Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet. Be the first to leave one!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 dark:text-white">{r.name}</h4>
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(r.rating)].map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{r.text}</p>
                {user?.uid === r.uid && (
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="text-sm text-red-600 mt-2 hover:underline"
                  >
                    Delete Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

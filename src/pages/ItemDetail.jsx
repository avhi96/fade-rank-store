import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { setDoc, deleteDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FaHeart, FaShareAlt, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ItemDetails = ({ type = 'shopProducts' }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [liked, setLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      const ref = doc(db, type, id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setItem(data);
        const imageList = data.images || (data.image ? [data.image] : []);
        setActiveImage(imageList[0] || '/placeholder.jpg');

        if (user) {
          const likeRef = doc(db, 'users', user.uid, 'likedItems', id);
          const likeSnap = await getDoc(likeRef);
          setLiked(likeSnap.exists());
        }
      }

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setInCart(cart.some(c => c.id === id));
    };

    fetchItem();
  }, [id, type, user]);

  const userReview = item?.reviews?.find(r => r.uid === user?.uid);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.find(c => c.id === id)) return toast.error('Item already in cart!');
    const newItem = { ...item, id };
    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    setInCart(true);
    toast.success('Item added to cart!');
  };

  const handleBuyNow = () => {
    localStorage.setItem('buyNowItem', JSON.stringify({ ...item, id }));
    navigate('/checkout');
  };


  const handleShare = () => {
    navigator.share?.({
      title: item?.name,
      text: item?.description,
      url: window.location.href,
    }) || toast.error('Sharing not supported');
  };

  const handleToggleLike = async () => {
    if (!user) return toast.error("Login to like products");

    const ref = doc(db, 'users', user.uid, 'likedItems', id);
    try {
      if (liked) {
        await deleteDoc(ref);
        toast.success("Removed from likes");
      } else {
        await setDoc(ref, {
          id,
          name: item.name,
          price: item.price,
          image: item.images?.[0] || item.image || '/placeholder.jpg',
          type,
          timestamp: Date.now()
        });
        toast.success("Added to likes");
      }
      setLiked(!liked);
    } catch (err) {
      toast.error("Failed to update like status");
      console.error(err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewRating || !reviewText.trim()) {
      return toast.error("Please provide rating and review");
    }

    const review = {
      uid: user.uid,
      name: user.displayName || user.email,
      rating: reviewRating,
      text: reviewText.trim(),
      timestamp: Date.now(),
    };

    const ref = doc(db, type, id);
    try {
      if (userReview) {
        await updateDoc(ref, { reviews: arrayRemove(userReview) });
      }
      await updateDoc(ref, { reviews: arrayUnion(review) });

      setItem(prev => ({
        ...prev,
        reviews: [...(prev.reviews?.filter(r => r.uid !== user.uid) || []), review]
      }));

      setReviewRating(0);
      setReviewText('');
      toast.success(userReview ? "Review updated!" : "Review submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      const ref = doc(db, type, id);
      await updateDoc(ref, { reviews: arrayRemove(review) });
      setItem(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r.timestamp !== review.timestamp)
      }));
      toast.success("Review deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  if (!item) return (
    <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
      Loading item...
    </div>
  );

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      {/* Image and Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div>
          <img src={activeImage} alt={item.name} className="w-full h-[400px] object-contain border rounded-lg bg-white dark:bg-gray-800" />

          {/* Carousel */}
          {(item.images?.length > 1) && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  const images = item.images;
                  const currentIndex = images.indexOf(activeImage);
                  const prevIndex = (currentIndex - 1 + images.length) % images.length;
                  setActiveImage(images[prevIndex]);
                }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                ◀ Prev
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.images.indexOf(activeImage) + 1} / {item.images.length}
              </span>
              <button
                onClick={() => {
                  const images = item.images;
                  const currentIndex = images.indexOf(activeImage);
                  const nextIndex = (currentIndex + 1) % images.length;
                  setActiveImage(images[nextIndex]);
                }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Next ▶
              </button>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-4 text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({item.reviews?.length || 0} reviews)</span>
          </div>
          {item.discount > 0 ? (
            <div>
              <p className="text-2xl text-gray-500 line-through mb-1">₹{item.price}</p>
              <p className="text-4xl font-semibold text-green-600 dark:text-green-400">
                ₹{(item.price - item.price * item.discount / 100).toFixed(0)}
              </p>
              <p className="text-sm text-red-500 mt-1">{item.discount}% OFF</p>
            </div>
          ) : (
            <p className="text-4xl font-semibold text-green-600 dark:text-green-400">
              ₹{item.price}
            </p>
          )}


          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 text-sm">
            <p><strong>Delivery:</strong> Free - Est. 5–7 days</p>
            <p><strong>Return:</strong> 7-day easy return</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button onClick={handleBuyNow} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full sm:w-auto">
              Buy Now
            </button>
            {inCart ? (
              <button onClick={() => navigate('/cart')} className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 w-full sm:w-auto">
                Go to Cart
              </button>
            ) : (
              <button onClick={handleAddToCart} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto">
                <FaShoppingCart className="inline-block mr-2" /> Add to Cart
              </button>
            )}
          </div>


          <div className="flex gap-4 mt-4">
            <button onClick={handleToggleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${liked ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}>
              <FaHeart /> {liked ? 'Liked' : 'Like'}
            </button>
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
              <FaShareAlt /> Share
            </button>
          </div>
          {/* ✅ Full Description Section */}
          <div className="mt-6 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {item.fullDescription || item.description}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Customer Reviews</h2>

        {user ? (
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
            <p className="font-semibold mb-2">Your Review:</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-xl ${reviewRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setReviewRating(star)}
                />
              ))}
            </div>
            <textarea
              rows="4"
              className="w-full p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="mt-3 flex gap-4">
              <button onClick={handleReviewSubmit} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                {userReview ? 'Update Review' : 'Submit Review'}
              </button>
              {userReview && (
                <button onClick={() => handleDeleteReview(userReview)} className="text-red-500 hover:underline">
                  Delete Review
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please <Link to="/login" className="text-blue-500 underline">login</Link> to write a review.
          </p>
        )}

        <div className="space-y-4">
          {(item.reviews || []).map((review, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700">
              <p className="font-semibold">{review.name}</p>
              <div className="text-yellow-500 text-sm mb-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={`inline ${review.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

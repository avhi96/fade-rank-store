// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { db } from '../firebase';
// import { setDoc, deleteDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
// import { FaHeart, FaShareAlt, FaShoppingCart, FaStar } from 'react-icons/fa';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-hot-toast';

// const ItemDetails = ({ type = 'shopItems' }) => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const [item, setItem] = useState(null);
//   const [liked, setLiked] = useState(false);
//   const [activeImage, setActiveImage] = useState(null);
//   const [inCart, setInCart] = useState(false);
//   const navigate = useNavigate();



//   const [reviewText, setReviewText] = useState('');
//   const [reviewRating, setReviewRating] = useState(0);

//   useEffect(() => {
//     const fetchItem = async () => {
//       const ref = doc(db, type, id);
//       const snap = await getDoc(ref);
//       if (snap.exists()) {
//         const data = snap.data();
//         setItem(data);
//         setActiveImage(data.image);

//         if (user) {
//           const likeRef = doc(db, 'users', user.uid, 'likedItems', id);
//           const likeSnap = await getDoc(likeRef);
//           setIsLiked(likeSnap.exists());
//         }
//       }

//       const cart = JSON.parse(localStorage.getItem('cart')) || [];
//       setInCart(cart.some(c => c.id === id));
//     };

//     fetchItem();
//   }, [id, type, user]);


//   const userReview = item?.reviews?.find(r => r.uid === user?.uid);

//   const handleAddToCart = () => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     const alreadyInCart = cart.find(c => c.id === id);

//     if (alreadyInCart) {
//       toast.error('Item already in cart!');
//       return;
//     }

//     const newItem = { ...item, id };
//     cart.push(newItem);
//     localStorage.setItem('cart', JSON.stringify(cart));
//     toast.success('Item added to cart!');
//     setInCart(true);
//   };


//   const handleBuyNow = () => toast.success('Redirecting to payment...');

//   const handleShare = () => {
//     navigator.share?.({
//       title: item?.name,
//       text: item?.description,
//       url: window.location.href,
//     }) || toast.error('Sharing not supported.');
//   };

//   const handleReviewSubmit = async () => {
//     if (!reviewRating || !reviewText.trim()) {
//       toast.error("Please provide a rating and a review.");
//       return;
//     }

//     const review = {
//       uid: user.uid,
//       name: user.displayName || user.email,
//       rating: reviewRating,
//       text: reviewText.trim(),
//       timestamp: Date.now(),
//     };

//     const ref = doc(db, type, id);
//     try {
//       // If user already has a review → remove first
//       if (userReview) {
//         await updateDoc(ref, {
//           reviews: arrayRemove(userReview)
//         });
//       }

//       await updateDoc(ref, {
//         reviews: arrayUnion(review)
//       });

//       // Update UI
//       setItem(prev => ({
//         ...prev,
//         reviews: [...(prev.reviews?.filter(r => r.uid !== user.uid) || []), review]
//       }));

//       setReviewRating(0);
//       setReviewText('');
//       toast.success(userReview ? "Review updated!" : "Review submitted!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to submit review.");
//     }
//   };

//   const handleToggleLike = async () => {
//     if (!user) {
//       toast.error('Login required to like items');
//       return;
//     }

//     const ref = doc(db, 'users', user.uid, 'likedItems', id);

//     try {
//       if (liked) {
//         await deleteDoc(ref);
//         toast.success('Item removed from likes');
//       } else {
//         await setDoc(ref, {
//           id,
//           name: item.name,
//           price: item.price,
//           image: item.image,
//           timestamp: Date.now(),
//         });
//         toast.success('Item added to likes');
//       }
//       setLiked(!liked);

//     } catch (err) {
//       toast.error('Failed to update like');
//       console.error(err);
//     }
//   };


//   const handleDeleteReview = async (review) => {
//     try {
//       const ref = doc(db, type, id);
//       await updateDoc(ref, {
//         reviews: arrayRemove(review)
//       });
//       setItem(prev => ({
//         ...prev,
//         reviews: prev.reviews.filter(r => r.timestamp !== review.timestamp)
//       }));
//       toast.success("Review deleted!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete review.");
//     }
//   };

//   if (!item) return <p className="text-center mt-20 text-gray-500">Loading item...</p>;

//   return (
//     <div className="p-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
//       {/* Image Gallery */}
//       <div className="space-y-4">
//         <img src={activeImage} alt={item.name} className="w-full h-[400px] object-contain border rounded" />
//         <div className="flex gap-2 overflow-x-auto">
//           {[item.image, ...(item.images || [])].map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`thumb-${i}`}
//               onClick={() => setActiveImage(img)}
//               className={`h-20 w-20 object-cover border cursor-pointer rounded ${img === activeImage ? 'border-blue-600' : 'border-gray-300'}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Product Details */}
//       <div className="space-y-4">
//         <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
//         <div className="flex items-center gap-2 text-yellow-500">
//           {[...Array(5)].map((_, i) => <FaStar key={i} />)}
//           <span className="text-sm text-gray-500 ml-2">({item.reviews?.length || 0} reviews)</span>
//         </div>

//         <p className="text-3xl text-blue-700 font-semibold">₹{item.price}</p>
//         <p className="text-gray-700">{item.description}</p>

//         <div className="bg-gray-50 p-4 rounded border text-sm">
//           <p><strong>Delivery:</strong> Free - Estimated by 5-7 days</p>
//           <p><strong>Return:</strong> 7 Days easy return policy</p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 mt-4">
//           <button
//             onClick={handleBuyNow}
//             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex-1"
//           >
//             Buy Now
//           </button>

//           {inCart ? (
//             <button
//               onClick={() => navigate('/cart')}
//               className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 flex-1"
//             >
//               Go to Cart
//             </button>
//           ) : (
//             <button
//               onClick={handleAddToCart}
//               className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex-1"
//             >
//               <FaShoppingCart className="inline-block mr-2" />
//               Add to Cart
//             </button>
//           )}
//         </div>


//         <div className="flex gap-3">
//           <button
//             onClick={handleToggleLike}
//             className={`flex items-center gap-2 px-4 py-2 rounded ${liked ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//           >
//             <FaHeart />
//             {liked ? 'Liked' : 'Like'}
//           </button>


//           <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300">
//             <FaShareAlt /> Share
//           </button>
//         </div>
//       </div>

//       {/* Review Section */}
//       <div className="col-span-2 mt-12">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>

//         {user ? (
//           <div className="mb-6 bg-white p-4 rounded shadow border">
//             <p className="font-semibold mb-2">Your Review:</p>
//             <div className="flex gap-1 mb-2">
//               {[1, 2, 3, 4, 5].map(star => (
//                 <FaStar
//                   key={star}
//                   className={`cursor-pointer ${reviewRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
//                   onClick={() => setReviewRating(star)}
//                 />
//               ))}
//             </div>
//             <textarea
//               rows="3"
//               placeholder="Your feedback..."
//               className="w-full p-2 border rounded"
//               value={reviewText}
//               onChange={(e) => setReviewText(e.target.value)}
//             />
//             <button
//               onClick={handleReviewSubmit}
//               className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
//             >
//               {userReview ? 'Update Review' : 'Submit Review'}
//             </button>
//             {userReview && (
//               <button
//                 onClick={() => handleDeleteReview(userReview)}
//                 className="ml-4 text-red-600 hover:underline"
//               >
//                 Delete
//               </button>
//             )}
//           </div>
//         ) : (
//           <p className="text-gray-600 mb-4">
//             Please <Link to="/login" className="text-blue-600 underline">login</Link> to write a review.
//           </p>
//         )}

//         <div className="space-y-4">
//           {(item.reviews || []).map((review, i) => (
//             <div key={i} className="bg-white p-4 rounded shadow border relative">
//               <p className="font-semibold">{review.name}</p>
//               <div className="text-sm text-yellow-500 mb-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <FaStar
//                     key={star}
//                     className={`inline ${review.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
//                   />
//                 ))}
//               </div>
//               <p className="text-gray-700">{review.text}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemDetails;

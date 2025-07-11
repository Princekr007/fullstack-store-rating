import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const OwnerDashboard = () => {
  const [store, setStore] = useState({});
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    fetchStoreRatings();
    fetchAverageRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Fetch Store and Ratings
  const fetchStoreRatings = async () => {
    try {
      const res = await API.get("/owner/ratings");
      setStore(res.data.store); // Store info
      setRatings(res.data.ratings); // Ratings list
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch store ratings");
    }
  };

  // ✅ Fetch Average Rating
  const fetchAverageRating = async () => {
    try {
      const res = await API.get("/owner/average-rating");
      setAverage(res.data.averageRating);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch average rating");
    }
  };

  return (
    <div>
      <Navbar role="owner" /> {/* ✅ Navbar for Store Owner */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Store Owner Dashboard</h1>

        {/* 🏪 Store Information */}
        <div className="p-4 bg-blue-100 rounded shadow mb-6">
          <h2 className="text-xl font-semibold">{store.name || "Your Store"}</h2>
          <p className="text-gray-700">📍 Address: {store.address || "N/A"}</p>
          <p className="text-gray-700">
            ⭐ Average Rating: {average ? average.toFixed(1) : "No ratings yet"}
          </p>
        </div>

        {/* 👥 Ratings List */}
        <h2 className="text-xl font-bold mb-2">User Ratings</h2>
        <ul className="border rounded p-4">
          {ratings.length === 0 ? (
            <p>No users have rated your store yet.</p>
          ) : (
            ratings.map((rating) => (
              <li
                key={rating.id}
                className="border-b last:border-none py-2 flex justify-between"
              >
                <span className="font-medium">{rating.User.name}</span>
                <span>⭐ {rating.rating}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default OwnerDashboard;

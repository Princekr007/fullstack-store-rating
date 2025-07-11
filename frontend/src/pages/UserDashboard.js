import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  // ✅ Fetch all stores
  const fetchStores = async () => {
    try {
      const res = await API.get("/user/stores");
      setStores(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stores");
    }
  };

  // ✅ Submit or update rating
  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await API.post("/user/rate-store", {
        store_id: selectedStore,
        rating,
      });
      alert("Rating submitted successfully!");
      setRating(""); // Clear rating input
      setSelectedStore(""); // Clear selected store
      fetchStores(); // 🔄 Refresh stores to reflect new rating
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  };

  return (
    <div>
      <Navbar role="user" /> {/* ✅ Navbar with cleaned links */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

        {/* 🏪 Store List */}
        <h2 className="text-xl font-semibold mb-2">Stores</h2>
        <ul className="border rounded p-4 mb-6">
          {stores.map((store) => (
            <li key={store.id} className="mb-2">
              <div className="font-bold">{store.name}</div>
              <div>📍 {store.address}</div>
              <div>⭐ Average Rating: {store.averageRating}</div>
              <div>📝 Your Rating: {store.userRating || "Not rated yet"}</div>
            </li>
          ))}
        </ul>

        {/* ⭐ Submit Rating */}
        <h2 className="text-xl font-semibold mb-2">Submit / Update Rating</h2>
        <form
          onSubmit={handleSubmitRating}
          className="bg-white p-4 rounded shadow max-w-sm"
        >
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full mb-3 border p-2 rounded"
            required
          >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full mb-3 border p-2 rounded"
            min="1"
            max="5"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;

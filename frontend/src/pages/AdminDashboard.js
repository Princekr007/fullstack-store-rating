import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userSort, setUserSort] = useState({ sortBy: "name", order: "ASC" });
  const [storeSort, setStoreSort] = useState({ sortBy: "name", order: "ASC" });

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSort, storeSort]); // ✅ re-fetch when sort changes

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get(
        `/admin/users?sortBy=${userSort.sortBy}&order=${userSort.order}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  const fetchStores = async () => {
    try {
      const res = await API.get(
        `/admin/stores?sortBy=${storeSort.sortBy}&order=${storeSort.order}`
      );
      setStores(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stores");
    }
  };

  const toggleUserOrder = () =>
    setUserSort((prev) => ({
      ...prev,
      order: prev.order === "ASC" ? "DESC" : "ASC",
    }));

  const toggleStoreOrder = () =>
    setStoreSort((prev) => ({
      ...prev,
      order: prev.order === "ASC" ? "DESC" : "ASC",
    }));

  return (
    <div>
      <Navbar role="admin" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-green-100 rounded shadow">
            <h2 className="font-semibold">Total Users</h2>
            <p className="text-xl">{summary.totalUsers}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded shadow">
            <h2 className="font-semibold">Total Stores</h2>
            <p className="text-xl">{summary.totalStores}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow">
            <h2 className="font-semibold">Total Ratings</h2>
            <p className="text-xl">{summary.totalRatings}</p>
          </div>
        </div>

        {/* Users */}
        <h2 className="text-xl font-bold mb-2">Users</h2>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold">Sort By:</label>
          <select
            value={userSort.sortBy}
            onChange={(e) =>
              setUserSort((prev) => ({ ...prev, sortBy: e.target.value }))
            }
            className="border px-2 py-1 rounded"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="role">Role</option>
          </select>
          <button
            onClick={toggleUserOrder}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            {userSort.order === "ASC" ? "⬆️ ASC" : "⬇️ DESC"}
          </button>
        </div>
        <ul className="border rounded p-4 mb-6">
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email} ({user.role})
            </li>
          ))}
        </ul>

        {/* Stores */}
        <h2 className="text-xl font-bold mb-2">Stores</h2>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold">Sort By:</label>
          <select
            value={storeSort.sortBy}
            onChange={(e) =>
              setStoreSort((prev) => ({ ...prev, sortBy: e.target.value }))
            }
            className="border px-2 py-1 rounded"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
          </select>
          <button
            onClick={toggleStoreOrder}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            {storeSort.order === "ASC" ? "⬆️ ASC" : "⬇️ DESC"}
          </button>
        </div>
        <ul className="border rounded p-4">
          {stores.map((store) => (
            <li key={store.id}>
              <div className="flex justify-between">
                <div>
                  <strong>{store.name}</strong> - {store.email} (Owner ID: {store.owner_id})
                </div>
                <div>
                  ⭐ Average Rating:{" "}
                  <span className="font-semibold">{store.averageRating}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

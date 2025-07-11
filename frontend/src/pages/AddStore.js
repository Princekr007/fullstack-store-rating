import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const AddStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const [owners, setOwners] = useState([]); // Store owners list

  // Fetch all users with role = "owner"
  useEffect(() => {
    const fetchOwners = async () => {
  try {
    const res = await API.get("/admin/users?role=owner");
    console.log(res.data); // 🪵 Debug: See what backend sends
    setOwners(res.data.users || res.data); // ✅ Check for nested "users" field
  } catch (err) {
    console.error(err);
    alert("Failed to fetch store owners");
  }
};
    fetchOwners();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/add-store", formData);
      alert("Store created successfully!");
      setFormData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create store");
    }
  };

  return (
    <div>
      <Navbar role="admin" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add Store</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow max-w-md mx-auto"
        >
          <input
            type="text"
            name="name"
            placeholder="Store Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-3 border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Store Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-3 border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Store Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mb-3 border p-2 rounded"
            required
          />
          {/* ✅ Dropdown for Owners */}
          <select
            name="owner_id"
            value={formData.owner_id}
            onChange={handleChange}
            className="w-full mb-3 border p-2 rounded"
            required
          >
            <option value="">Select Store Owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Add Store
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;

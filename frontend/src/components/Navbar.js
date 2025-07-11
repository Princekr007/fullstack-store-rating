import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Store Rating App</div>

      <div className="flex gap-4 items-center">
        {/* ✅ Admin Links */}
        {role === "admin" && (
          <>
            <Link
              to="/admin"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/add-user"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Add User
            </Link>
            <Link
              to="/admin/add-store"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Add Store
            </Link>
          </>
        )}

        {/* ✅ Store Owner Links */}
        {role === "owner" && (
          <>
            <Link
              to="/owner"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              My Store
            </Link>
            <Link
              to="/owner/ratings"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Ratings
            </Link>
          </>
        )}

        

        {/* ✅ Update Password (Visible to all roles) */}
        <Link
          to="/update-password"
          className="hover:bg-yellow-600 px-3 py-2 rounded bg-yellow-500 text-black"
        >
          Update Password
        </Link>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

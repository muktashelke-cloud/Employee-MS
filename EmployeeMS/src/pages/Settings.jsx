import { FiBell, FiLock, FiMoon, FiUser } from "react-icons/fi";

const Settings = () => {
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Settings
      </h1>

      <div className="grid gap-4">

        <div className="p-5 bg-white rounded-2xl shadow border flex items-center gap-4">
          <FiUser size={22} />
          <div>
            <h3 className="font-semibold">Profile Settings</h3>
            <p className="text-sm text-gray-500">
              Update profile information
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow border flex items-center gap-4">
          <FiLock size={22} />
          <div>
            <h3 className="font-semibold">Change Password</h3>
            <p className="text-sm text-gray-500">
              Update your password
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow border flex items-center gap-4">
          <FiBell size={22} />
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-gray-500">
              Manage notifications
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow border flex items-center gap-4">
          <FiMoon size={22} />
          <div>
            <h3 className="font-semibold">Appearance</h3>
            <p className="text-sm text-gray-500">
              Light / Dark mode
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
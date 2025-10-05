import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiLogOut,
  FiBarChart2,
  FiUsers,
  FiFileText,
  FiSettings,
  FiMail,
  FiCalendar,
  FiBell,
  FiTool,
  FiMessageSquare
} from "react-icons/fi";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { AuthContext } from "../../stores/authStore";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection }) => {
  const { logoutAdmin } = useContext(AuthContext);

  // Navigation items
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: FiBarChart2 },
    { key: "properties", label: "Properties", icon: FiHome },
    { key: "applications", label: "Applications", icon: FiUsers },
    { key: "pre-screening", label: "Pre-Screening", icon: FiFileText },
    { key: "maintenance", label: "Maintenance", icon: FiTool },
    { key: "chatbot", label: "Chatbot Analytics", icon: FiMessageSquare },
    { key: "notices", label: "Notice Management", icon: FiBell },
    { key: "team", label: "Team Management", icon: FiUsers },
    { key: "contacts", label: "Contact Messages", icon: FiMail },
    { key: "settings", label: "Settings", icon: FiSettings }
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`transition-all duration-200 min-h-screen sticky top-0 ${
          sidebarOpen ? "w-64" : "w-23"
        } bg-[var(--color-darker)] text-[var(--color-bg)] shadow-xl`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--color-secondary)] font-bold bg-[var(--color-bg)]">
              PR
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">PropertyRent</h1>
                <p className="text-sm opacity-70">Admin Panel</p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === item.key
                      ? "bg-[var(--color-secondary)] text-white"
                      : "hover:bg-[var(--color-dark)]"
                  }`}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
            
            <div className="pt-6 mt-6 border-t border-[var(--color-dark)]">
              <Link
                to="/"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-dark)] transition-colors"
              >
                <FiHome className="text-xl flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">Back to Site</span>}
              </Link>
              <button
                onClick={logoutAdmin}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600/20 text-red-400 transition-colors"
              >
                <FiLogOut className="text-xl flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">Sign out</span>}
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        className="py-2 bg-[var(--color-darker)] text-[var(--color-bg)] rounded-r-full hover:opacity-90 transition-opacity"
        onClick={() => setSidebarOpen((s) => !s)}
        title="Toggle sidebar"
        style={{ left: sidebarOpen ? '256px' : '83px' }}
      >
        {sidebarOpen ? <IoMdArrowDropleft className="text-xl" /> : <IoMdArrowDropright className="text-xl" />}
      </button>
    </>
  );
};

export default Sidebar;
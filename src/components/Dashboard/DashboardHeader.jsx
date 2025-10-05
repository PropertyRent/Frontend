import { FiSearch } from "react-icons/fi";

const DashboardHeader = ({ activeSection, query, setQuery }) => {
  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "properties", label: "Properties" },
    { key: "applications", label: "Applications" },
    { key: "pre-screening", label: "Pre-Screening" },
    { key: "settings", label: "Settings" }
  ];

  const getDescription = (section) => {
    switch (section) {
      case "dashboard":
        return "Overview of your property management";
      case "properties":
        return "Manage your property listings";
      case "applications":
        return "Review tenant applications";
      case "pre-screening":
        return "Manage pre-screening questions";
      case "settings":
        return "Configure your preferences";
      default:
        return "";
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-darkest)]">
          {navItems.find(item => item.key === activeSection)?.label || "Dashboard"}
        </h1>
        <p className="text-[var(--color-muted)] mt-1">
          {getDescription(activeSection)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        
        <div className="text-sm text-[var(--color-muted)]">
          Welcome back, <strong className="text-[var(--color-darkest)]">Admin</strong>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
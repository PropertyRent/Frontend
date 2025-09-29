import { FiHome, FiCheckCircle, FiUsers } from "react-icons/fi";

const DashboardOverview = ({ stats, properties, applications }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Total Properties</p>
              <p className="text-3xl font-bold text-[var(--color-darkest)]">{stats.totalProperties}</p>
            </div>
            <FiHome className="text-3xl text-[var(--color-secondary)]" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Available</p>
              <p className="text-3xl font-bold text-green-600">{stats.availableProperties}</p>
            </div>
            <FiCheckCircle className="text-3xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Applications</p>
              <p className="text-3xl font-bold text-[var(--color-secondary)]">{stats.totalApplications}</p>
            </div>
            <FiUsers className="text-3xl text-[var(--color-secondary)]" />
          </div>
        </div>
      </div>

      {/* Recent Properties & Applications */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">Recent Properties</h3>
          <div className="space-y-3">
            {properties.slice(0, 3).map((property) => (
              <div key={property.id} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-bg)]">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-[var(--color-darkest)]">{property.title}</h4>
                  <p className="text-sm text-[var(--color-muted)]">${property.price}/month</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.status === 'Available' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">Recent Applications</h3>
          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-bg)]">
                <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white font-semibold">
                  {app.applicantName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-[var(--color-darkest)]">{app.applicantName}</h4>
                  <p className="text-sm text-[var(--color-muted)]">{app.propertyTitle}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  app.status === 'Approved' 
                    ? 'bg-green-100 text-green-800'
                    : app.status === 'Pending Review'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
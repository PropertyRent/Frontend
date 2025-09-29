import { FiMail, FiPhone, FiCalendar, FiCheckCircle, FiXCircle, FiEye } from "react-icons/fi";

const ApplicationsSection = ({ applications, updateApplicationStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
      <div className="p-6 border-b border-[var(--color-tan)]/20">
        <h3 className="text-lg font-semibold text-[var(--color-darkest)]">Applications ({applications.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--color-bg)]">
            <tr>
              <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Applicant</th>
              <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Property</th>
              <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Move-in Date</th>
              <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Status</th>
              <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-tan)]/20">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-[var(--color-bg)] transition-colors">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-[var(--color-darkest)]">{app.applicantName}</div>
                    <div className="text-sm text-[var(--color-muted)] flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiMail className="w-3 h-3" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiPhone className="w-3 h-3" />
                        {app.phone}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-[var(--color-darkest)]">{app.propertyTitle}</div>
                  <div className="text-sm text-[var(--color-muted)]">{app.peopleCount} people, {app.pets}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-[var(--color-darkest)]">
                    <FiCalendar className="w-4 h-4" />
                    {app.moveInDate}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === 'Approved' 
                      ? 'bg-green-100 text-green-800'
                      : app.status === 'Pending Review'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateApplicationStatus(app.id, 'Approved')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <FiXCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-light)] rounded-lg transition-colors">
                      <FiEye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsSection;
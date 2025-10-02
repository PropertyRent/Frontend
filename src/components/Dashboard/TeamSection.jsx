import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiUser,
  FiExternalLink,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import TeamService from '../../services/teamService';

const TeamSection = ({ onNavigateToTeam }) => {
  const [stats, setStats] = useState({
    total: 0,
    positions: {},
    recent_members: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const response = await TeamService.getTeamStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              <p className="text-sm text-gray-600">Manage your team</p>
            </div>
          </div>
          <button
            onClick={onNavigateToTeam}
            className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <span>Manage</span>
            <FiExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.positions).length}</div>
            <div className="text-sm text-gray-600">Positions</div>
          </div>
        </div>

        {/* Top Positions */}
        {Object.keys(stats.positions).length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Team Positions</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.positions)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([position, count]) => (
                  <span
                    key={position}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {position} ({count})
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Team Members */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Members</h4>
        
        {stats.recent_members.length === 0 ? (
          <div className="text-center py-8">
            <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No team members yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recent_members.slice(0, 3).map((member) => (
              <div key={member.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  {member.photo ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={member.photo}
                      alt={member.name}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(member.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-purple-600 font-medium mb-1">{member.position_name}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiMail className="w-3 h-3" />
                      <span className="truncate max-w-24">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-1">
                        <FiPhone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* View More Button */}
            <button
              onClick={onNavigateToTeam}
              className="w-full py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              View all team members
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSection;
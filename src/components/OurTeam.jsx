import React, { useState, useEffect } from 'react';
import TeamService from '../services/teamService';
import TeamSkeleton from './skeleton/TeamSkeleton';
import { FiUser } from 'react-icons/fi';

// Separate OurTeam component
export function OurTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await TeamService.getAllTeamMembers({ 
        limit: 20, 
        offset: 0 
      });
      
      if (response.success) {
        setTeam(response.data.team_members);
        console.log('Team members loaded successfully:', response.data.team_members);
      } else {
        setError('Failed to load team members');
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <TeamSkeleton count={4} />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadTeamMembers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (team.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-[var(--color-darker)]">No team members found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center text-center rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 ring-4 ring-offset-2 ring-[var(--color-bg)]">
              {member.photo ? (
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-tan)] flex items-center justify-center">
                  <FiUser className="w-12 h-12 text-[var(--color-darker)]" />
                </div>
              )}
            </div>

            <div className="text-[var(--color-darkest)] font-semibold">{member.name}</div>
            <div className="text-sm text-[var(--color-secondary)] font-medium mb-2">{member.position_name}</div>
            {member.description && (
              <p className="text-sm text-[var(--color-darker)] line-clamp-3">{member.description}</p>
            )}
            {member.age && (
              <p className="text-xs text-[var(--color-muted)] mt-2">Age: {member.age}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
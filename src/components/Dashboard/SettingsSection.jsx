import { useContext } from "react";
import { 
  FiUser, 
  FiLoader, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiXCircle, 
  FiEdit3, 
  FiSave,
  FiCamera,
  FiX 
} from "react-icons/fi";
import { PropertyContext } from "../../stores/propertyStore";
import ProfileSkeleton from "../skeleton/ProfileSkeleton";

const SettingsSection = ({ 
  profileForm, 
  isEditingProfile, 
  handleProfileChange, 
  handleProfileSubmit, 
  handleEditProfile, 
  handleCancelEdit, 
  handleGetProfile,
  profilePhoto,
  profilePhotoPreview,
  profilePhotoInputRef,
  handleProfilePhotoChange,
  handleRemoveProfilePhoto
}) => {
  const { 
    profile, 
    profileLoading, 
    updateProfileLoading, 
    profileError, 
    updateProfileError 
  } = useContext(PropertyContext);

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--color-darkest)] flex items-center gap-2">
            <FiUser className="text-xl" />
            Admin Profile
          </h3>
          {!isEditingProfile && profile && (
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white rounded-lg transition-colors"
            >
              <FiEdit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {profileLoading ? (
          <ProfileSkeleton />
        ) : profileError ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <FiAlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 mb-4">{profileError}</p>
              <button
                onClick={handleGetProfile}
                className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : profile && profile.user ? (
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Photo Section */}
              <div className="md:col-span-2 flex items-center gap-6">
                <div className="relative">
                  {/* Profile Photo Display */}
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-[var(--color-secondary)] flex items-center justify-center text-white text-2xl font-bold">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.user.full_name ? profile.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
                    )}
                  </div>
                  
                  {/* Photo Upload Controls - Only show in edit mode */}
                  {isEditingProfile && (
                    <div className="absolute -bottom-2 -right-2">
                      <button
                        type="button"
                        onClick={() => profilePhotoInputRef.current?.click()}
                        className="bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white p-2 rounded-full shadow-lg transition-colors"
                        title="Upload photo"
                      >
                        <FiCamera className="w-4 h-4" />
                      </button>
                      
                      {/* Hidden file input */}
                      <input
                        ref={profilePhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                        className="hidden"
                      />
                    </div>
                  )}
                  
                  {/* Remove Photo Button - Only show if there's a photo preview and in edit mode */}
                  {isEditingProfile && profilePhotoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveProfilePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors"
                      title="Remove photo"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[var(--color-darkest)]">
                    {profile.user.full_name || 'No name provided'}
                  </h4>
                  <p className="text-[var(--color-muted)]">{profile.user.role || 'User'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {profile.user.is_verified ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <FiCheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-sm">
                        <FiXCircle className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                  
                  {/* Photo Upload Instructions - Only show in edit mode */}
                  {isEditingProfile && (
                    <div className="mt-2">
                      <p className="text-xs text-[var(--color-muted)]">
                        Click the camera icon to upload a new photo
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        Max size: 5MB • Formats: JPG, PNG, GIF
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Full Name</label>
                <input
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className={`w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                    !isEditingProfile ? 'bg-gray-50' : ''
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Email</label>
                <input
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  disabled={true}
                  type="email"
                  className={`w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]}`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Phone</label>
                <input
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className={`w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                    !isEditingProfile ? 'bg-gray-50' : ''
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              
              {/* Profile Photo Status */}
              {isEditingProfile && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Profile Photo</label>
                  <div className="flex items-center gap-4 p-3 border border-[var(--color-tan)]/50 rounded-lg bg-[var(--color-bg)]">
                    <FiCamera className="text-[var(--color-muted)]" />
                    <div className="flex-1">
                      {profilePhoto ? (
                        <span className="text-sm text-[var(--color-darkest)]">
                          New photo selected: {profilePhoto.name}
                        </span>
                      ) : profilePhotoPreview ? (
                        <span className="text-sm text-[var(--color-muted)]">
                          Current photo will be kept
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--color-muted)]">
                          No photo uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditingProfile && (
              <div className="flex gap-4 mt-6 pt-6 border-t border-[var(--color-tan)]/20">
                <button
                  type="submit"
                  disabled={updateProfileLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateProfileLoading ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={updateProfileLoading}
                  className="px-6 py-3 border border-[var(--color-tan)] rounded-lg hover:bg-[var(--color-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Error Display */}
            {updateProfileError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <FiAlertCircle className="w-5 h-5" />
                  <span className="font-medium">Update Failed</span>
                </div>
                <p className="text-red-700 mt-1">{updateProfileError}</p>
              </div>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <FiUser className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-2" />
              <p className="text-[var(--color-muted)] mb-4">No profile data available</p>
              <button
                onClick={handleGetProfile}
                className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white rounded-lg transition-colors"
              >
                Load Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
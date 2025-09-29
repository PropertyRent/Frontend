import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_APP_URL;

export const PropertyContext = createContext({
  // Profile states
  profile: null,
  setProfile: () => {},
  getProfile: () => {},
  updateProfile: () => {},
  // Separate loading states
  profileLoading: false,
  updateProfileLoading: false,
  // Separate error states
  profileError: null,
  updateProfileError: null,
  // Separate success states
  profileSuccess: null,
  updateProfileSuccess: null,
  // Clear methods
  clearProfileError: () => {},
  clearAllProfileErrors: () => {},
  
  // Properties states
  properties: [],
  setProperties: () => {},
  fetchProperties: () => {},
  // Properties loading states
  propertiesLoading: false,
  // Properties error states
  propertiesError: null,
  // Properties success states
  propertiesSuccess: null,
  // Properties pagination
  propertiesPagination: null,
  // Properties filters
  propertiesFilters: {},
  // Clear properties methods
  clearPropertiesError: () => {},
  
  // Single property states
  currentProperty: null,
  setCurrentProperty: () => {},
  fetchProperty: () => {},
  // Single property loading states
  propertyLoading: false,
  // Single property error states
  propertyError: null,
  // Single property success states
  propertySuccess: null,
  // Clear single property methods
  clearPropertyError: () => {},
});

const PropertyProvider = ({ children }) => {
  // Profile state
  const [profile, setProfile] = useState(null);

  // Separate loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);

  // Separate error states
  const [profileError, setProfileError] = useState(null);
  const [updateProfileError, setUpdateProfileError] = useState(null);

  // Separate success states
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(null);

  // Properties state
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState(null);
  const [propertiesSuccess, setPropertiesSuccess] = useState(null);
  const [propertiesPagination, setPropertiesPagination] = useState(null);
  const [propertiesFilters, setPropertiesFilters] = useState({});

  // Single property state
  const [currentProperty, setCurrentProperty] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [propertyError, setPropertyError] = useState(null);
  const [propertySuccess, setPropertySuccess] = useState(null);

  const clearProfileError = () => {
    setProfileError(null);
    setUpdateProfileError(null);
  };

  const clearAllProfileErrors = () => {
    setProfileError(null);
    setUpdateProfileError(null);
    setProfileSuccess(null);
    setUpdateProfileSuccess(null);
  };

  const clearPropertiesError = () => {
    setPropertiesError(null);
    setPropertiesSuccess(null);
  };

  const clearPropertyError = () => {
    setPropertyError(null);
    setPropertySuccess(null);
  };

  const getProfile = async () => {
    const loadingToast = toast.loading("Fetching profile...");
    try {
      setProfileLoading(true);
      setProfileError(null);
      
      const response = await axios.get(
        `${apiUrl}/api/user/profile`,
        { withCredentials: true }
      );
      
      console.log("Profile data:", response.data);
      if (response.data && response.data.success) {
        setProfile(response.data);
        
        const successMessage = "Profile loaded successfully!";
        setProfileSuccess(successMessage);
        
        toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Get profile error:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch profile. Please try again.";
      
      setProfileError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const loadingToast = toast.loading("Updating profile...");
    try {
      setUpdateProfileLoading(true);
      setUpdateProfileError(null);
      
      // Create FormData instance
      const formData = new FormData();
      
      // Append profile data to FormData
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          // Handle file uploads (like profile_photo)
          if (profileData[key] instanceof File) {
            formData.append(key, profileData[key]);
          } else {
            // Convert non-string values to string for FormData
            formData.append(key, String(profileData[key]));
          }
        }
      });
      
      const response = await axios.put(
        `${apiUrl}/api/user/profile`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Update profile response:", response.data);
      if (response.data && response.data.success) {
        // Update the profile state with new data
        setProfile(prevProfile => ({
          ...prevProfile,
          user: response.data.user
        }));
        
        const successMessage = response.data.message || "Profile updated successfully!";
        setUpdateProfileSuccess(successMessage);
        
        toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      
      setUpdateProfileError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  const fetchProperties = async (filters = {}) => {
    console.log("Fetching properties with filters:", filters);
    const loadingToast = toast.loading("Fetching properties...");
    try {
      setPropertiesLoading(true);
      setPropertiesError(null);
      
      
      const url = `${apiUrl}/api/properties`;
      
      const response = await axios.get(url, { withCredentials: true });
      
      console.log("Properties response:", response.data);
      if (response.data && response.data.success) {
        setProperties(response.data.data || []);
        setPropertiesPagination(response.data.pagination || null);
        setPropertiesFilters(response.data.filters_applied || {});
        
        const successMessage = response.data.message || "Properties loaded successfully!";
        setPropertiesSuccess(successMessage);
        
        toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Fetch properties error:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch properties. Please try again.";
      
      setPropertiesError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setPropertiesLoading(false);
    }
  };

  const fetchProperty = async (propertyId) => {
    console.log("Fetching property with ID:", propertyId);
    const loadingToast = toast.loading("Fetching property details...");
    try {
      setPropertyLoading(true);
      setPropertyError(null);
      
      const url = `${apiUrl}/api/properties/${propertyId}`;
      
      const response = await axios.get(url, { withCredentials: true });
      
      console.log("Property response:", response.data);
      if (response.data && response.data.success) {
        setCurrentProperty(response.data.data || null);
        
        const successMessage = response.data.message || "Property loaded successfully!";
        setPropertySuccess(successMessage);
        
        toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Fetch property error:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch property details. Please try again.";
      
      setPropertyError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setPropertyLoading(false);
    }
  };

  return (
    <PropertyContext.Provider value={{
      // Profile states
      profile,
      setProfile,
      getProfile,
      updateProfile,
      // Separate loading states
      profileLoading,
      updateProfileLoading,
      // Separate error states
      profileError,
      updateProfileError,
      // Separate success states
      profileSuccess,
      updateProfileSuccess,
      // Clear methods
      clearProfileError,
      clearAllProfileErrors,
      
      // Properties states
      properties,
      setProperties,
      fetchProperties,
      // Properties loading states
      propertiesLoading,
      // Properties error states
      propertiesError,
      // Properties success states
      propertiesSuccess,
      // Properties pagination
      propertiesPagination,
      // Properties filters
      propertiesFilters,
      // Clear properties methods
      clearPropertiesError,
      
      // Single property states
      currentProperty,
      setCurrentProperty,
      fetchProperty,
      // Single property loading states
      propertyLoading,
      // Single property error states
      propertyError,
      // Single property success states
      propertySuccess,
      // Clear single property methods
      clearPropertyError,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyProvider;
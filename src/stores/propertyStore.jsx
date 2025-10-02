import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  searchProperties: () => {},
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
  
  // Add property states
  addProperty: () => {},
  // Add property loading states
  addPropertyLoading: false,
  // Add property error states
  addPropertyError: null,
  // Add property success states
  addPropertySuccess: null,
  // Clear add property methods
  clearAddPropertyError: () => {},
  
  // Update property states
  updateProperty: () => {},
  // Update property loading states
  updatePropertyLoading: false,
  // Update property error states
  updatePropertyError: null,
  // Update property success states
  updatePropertySuccess: null,
  // Clear update property methods
  clearUpdatePropertyError: () => {},
  
  // Delete property states
  deleteProperty: () => {},
  // Delete property loading states
  deletePropertyLoading: false,
  // Delete property error states
  deletePropertyError: null,
  // Delete property success states
  deletePropertySuccess: null,
  // Clear delete property methods
  clearDeletePropertyError: () => {},
  
  // Cover images states
  coverImages: [],
  setCoverImages: () => {},
  fetchCoverImages: () => {},
  // Cover images loading states
  coverImagesLoading: false,
  // Cover images error states
  coverImagesError: null,
  // Cover images success states
  coverImagesSuccess: null,
  // Clear cover images methods
  clearCoverImagesError: () => {},
  
  // Property stats states
  propertyStats: null,
  setPropertyStats: () => {},
  fetchPropertyStats: () => {},
  // Property stats loading states
  propertyStatsLoading: false,
  // Property stats error states
  propertyStatsError: null,
  // Property stats success states
  propertyStatsSuccess: null,
  // Clear property stats methods
  clearPropertyStatsError: () => {},
  
  // Recent properties states
  recentProperties: [],
  setRecentProperties: () => {},
  fetchRecentProperties: () => {},
  // Recent properties loading states
  recentPropertiesLoading: false,
  // Recent properties error states
  recentPropertiesError: null,
  // Recent properties success states
  recentPropertiesSuccess: null,
  // Clear recent properties methods
  clearRecentPropertiesError: () => {},
});

const PropertyProvider = ({ children }) => {
  // Profile state
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  
  // Add logout state to prevent multiple logout calls
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Add property state
  const [addPropertyLoading, setAddPropertyLoading] = useState(false);
  const [addPropertyError, setAddPropertyError] = useState(null);
  const [addPropertySuccess, setAddPropertySuccess] = useState(null);

  // Update property state
  const [updatePropertyLoading, setUpdatePropertyLoading] = useState(false);
  const [updatePropertyError, setUpdatePropertyError] = useState(null);
  const [updatePropertySuccess, setUpdatePropertySuccess] = useState(null);

  // Delete property state
  const [deletePropertyLoading, setDeletePropertyLoading] = useState(false);
  const [deletePropertyError, setDeletePropertyError] = useState(null);
  const [deletePropertySuccess, setDeletePropertySuccess] = useState(null);
  
  // Cover images state
  const [coverImages, setCoverImages] = useState([]);
  const [coverImagesLoading, setCoverImagesLoading] = useState(false);
  const [coverImagesError, setCoverImagesError] = useState(null);
  const [coverImagesSuccess, setCoverImagesSuccess] = useState(null);
  
  // Property stats state
  const [propertyStats, setPropertyStats] = useState(null);
  const [propertyStatsLoading, setPropertyStatsLoading] = useState(false);
  const [propertyStatsError, setPropertyStatsError] = useState(null);
  const [propertyStatsSuccess, setPropertyStatsSuccess] = useState(null);
  
  // Recent properties state
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentPropertiesLoading, setRecentPropertiesLoading] = useState(false);
  const [recentPropertiesError, setRecentPropertiesError] = useState(null);
  const [recentPropertiesSuccess, setRecentPropertiesSuccess] = useState(null);

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

  const clearAddPropertyError = () => {
    setAddPropertyError(null);
    setAddPropertySuccess(null);
  };

  const clearUpdatePropertyError = () => {
    setUpdatePropertyError(null);
    setUpdatePropertySuccess(null);
  };

  const clearDeletePropertyError = () => {
    setDeletePropertyError(null);
    setDeletePropertySuccess(null);
  };
  
  const clearCoverImagesError = () => {
    setCoverImagesError(null);
    setCoverImagesSuccess(null);
  };
  
  const clearPropertyStatsError = () => {
    setPropertyStatsError(null);
    setPropertyStatsSuccess(null);
  };
  
  const clearRecentPropertiesError = () => {
    setRecentPropertiesError(null);
    setRecentPropertiesSuccess(null);
  };

  // Handle 401 errors with immediate logout and redirect
  const handle401Error = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      // Clear all user data immediately
      localStorage.removeItem("adminUser");
      
      // Call logout API without waiting for response
      axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true })
        .catch(error => console.error("Logout API error:", error));
      
      // Force hard redirect to login page to bypass any React routing issues
      window.location.href = "/admin-login";
    } catch (error) {
      console.error("401 handling error:", error);
      // Even if everything fails, force redirect
      window.location.href = "/admin-login";
    }
  };

  const getProfile = async () => {
    // const loadingToast = toast.loading("Fetching profile...");
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
        
        // toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Get profile error:", error);
      if(error.response?.status === 401){
        handle401Error();
        return;
      }
      const errorMessage = error.response?.data?.message || "Failed to fetch profile. Please try again.";
      
      setProfileError(errorMessage);
      // toast.error(errorMessage, { id: loadingToast });
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
      if(error.response?.status === 401){
        handle401Error();
        return;
      }
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
    // const loadingToast = toast.loading("Fetching properties...");
    try {
      setPropertiesLoading(true);
      setPropertiesError(null);
      
      
      const url = `${apiUrl}/api/properties`;
      
      const response = await axios.get(url, { withCredentials: true });
      
      console.log("Properties response:", response.data);
      if (response.data && response.data.success) {
        setProperties(response.data?.data?.properties || []);
        setPropertiesPagination(response.data?.pagination || null);
        setPropertiesFilters(response.data?.filters_applied || {});

        const successMessage = response.data.message || "Properties loaded successfully!";
        setPropertiesSuccess(successMessage);
        
        // toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Fetch properties error:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch properties. Please try again.";
      
      setPropertiesError(errorMessage);
      // toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setPropertiesLoading(false);
    }
  };

  const searchProperties = async (searchParams = {}) => {
    console.log("Searching properties with params:", searchParams);
    // const loadingToast = toast.loading("Searching properties...");
    try {
      setPropertiesLoading(true);
      setPropertiesError(null);
      
      // Build query string from search parameters
      const queryParams = new URLSearchParams();
      
      // Add all non-empty parameters to query string
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] && searchParams[key] !== "" && searchParams[key] !== "any" && searchParams[key] !== "all") {
          if (key === 'priceRange' && Array.isArray(searchParams[key])) {
            queryParams.append('min_price', searchParams[key][0]);
            queryParams.append('max_price', searchParams[key][1]);
          } else if (key === 'keyword' || key === 'search') {
            queryParams.append('keyword', searchParams[key]);
          } else if (key === 'propertyType') {
            queryParams.append('property_type', searchParams[key]);
          } else if (key === 'bedrooms' || key === 'bathrooms') {
            queryParams.append(key, searchParams[key]);
          } else if (key === 'furnishing' || key === 'status' || key === 'city' || key === 'state') {
            queryParams.append(key, searchParams[key]);
          }
        }
      });
      
      const url = `${apiUrl}/api/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log("Search URL:", url);
      
      const response = await axios.get(url, { withCredentials: true });
      
      console.log("Search response:", response.data);
      if (response.data && response.data.success) {
        setProperties(response.data?.data?.properties || []);
        setPropertiesPagination(response.data?.pagination || null);
        setPropertiesFilters(response.data?.filters_applied || {});

        const successMessage = response.data.message || `Found ${response.data?.data?.properties?.length || 0} properties`;
        setPropertiesSuccess(successMessage);
        
        // toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Search properties error:", error);
      const errorMessage = error.response?.data?.message || "Failed to search properties. Please try again.";
      
      setPropertiesError(errorMessage);
      // toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setPropertiesLoading(false);
    }
  };

  const fetchProperty = async (propertyId) => {
    console.log("Fetching property with ID:", propertyId);
    // const loadingToast = toast.loading("Fetching property details...");
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
        
        // toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Fetch property error:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch property details. Please try again.";
      
      setPropertyError(errorMessage);
      // toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setPropertyLoading(false);
    }
  };

  const addProperty = async (propertyData) => {
    console.log("Adding property with data:", propertyData);
    const loadingToast = toast.loading("Adding property...");
    try {
      setAddPropertyLoading(true);
      setAddPropertyError(null);
      
      const url = `${apiUrl}/api/admin/properties/add`;
      
      const response = await axios.post(url, propertyData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      
      console.log("Add property response:", response.data);
      if (response.data && response.data.success) {
        // Optionally refresh the properties list
        if (properties.length > 0) {
          fetchProperties(); // Refresh the list
        }
        
        const successMessage = response.data.message || "Property added successfully!";
        setAddPropertySuccess(successMessage);
        
        toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Add property error:", error);
      if(error.response?.status === 401){
        handle401Error();
        return;
      }
      const errorMessage = error.response?.data?.message || "Failed to add property. Please try again.";
      
      setAddPropertyError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setAddPropertyLoading(false);
    }
  };

  const updateProperty = async (propertyId, propertyData) => {
    console.log("Updating property with ID:", propertyId, "Data:", propertyData);
    const loadingToast = toast.loading("Updating property...");
    try {
      setUpdatePropertyLoading(true);
      setUpdatePropertyError(null);
      
      const url = `${apiUrl}/api/admin/properties/${propertyId}`;
      
      const response = await axios.put(url, propertyData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Update property response:", response.data);
      if (response.data && response.data.success) {
        // Refresh the properties list to show updated data
        if (properties.length > 0) {
          fetchProperties(); // Refresh the list
        }
        
        // Update current property if it's the one being edited
        if (currentProperty && currentProperty.id === propertyId) {
          setCurrentProperty(response.data.data);
        }
        
        const successMessage = response.data.message || "Property updated successfully!";
        setUpdatePropertySuccess(successMessage);
        
        toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Update property error:", error);
      if(error.response?.status === 401){
        handle401Error();
        return;
      }
      const errorMessage = error.response?.data?.message || "Failed to update property. Please try again.";
      
      setUpdatePropertyError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setUpdatePropertyLoading(false);
    }
  };

  const deleteProperty = async (propertyId) => {
    console.log("Deleting property with ID:", propertyId);
    const loadingToast = toast.loading("Deleting property...");
    try {
      setDeletePropertyLoading(true);
      setDeletePropertyError(null);
      
      const url = `${apiUrl}/api/admin/properties/${propertyId}`;
      
      const response = await axios.delete(url, { 
        withCredentials: true
      });
      
      console.log("Delete property response:", response.data);
      if (response.data && response.data.success) {
        // Remove the property from the local state
        setProperties(prevProperties => prevProperties.filter(p => p.id !== propertyId));
        
        // Clear current property if it's the one being deleted
        if (currentProperty && currentProperty.id === propertyId) {
          setCurrentProperty(null);
        }
        
        const successMessage = response.data.message || "Property deleted successfully!";
        setDeletePropertySuccess(successMessage);
        
        toast.success(successMessage, { id: loadingToast });
        return response.data;
      }
    } catch (error) {
      console.error("Delete property error:", error);
      if(error.response?.status === 401){
        handle401Error();
        return;
      }
      const errorMessage = error.response?.data?.message || "Failed to delete property. Please try again.";
      
      setDeletePropertyError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setDeletePropertyLoading(false);
    }
  };
  
  const fetchCoverImages = async () => {
    console.log("Fetching cover images...");
    try {
      setCoverImagesLoading(true);
      setCoverImagesError(null);
      
      const url = `${apiUrl}/api/properties/cover-images/all`;
      
      const response = await axios.get(url, { withCredentials: true });
      
      console.log("Cover images response:", response.data);
      if (response.data && response.data.success) {
        setCoverImages(response.data.data || []);
        
        const successMessage = response.data.message || "Cover images loaded successfully!";
        setCoverImagesSuccess(successMessage);
        
        return response.data;
      }
    } catch (error) {
      console.error("Fetch cover images error:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch cover images. Please try again.";
      
      setCoverImagesError(errorMessage);
      throw error;
    } finally {
      setCoverImagesLoading(false);
    }
  };
  
  const fetchPropertyStats = async () => {
    console.log("Fetching property stats...");
    try {
      setPropertyStatsLoading(true);
      setPropertyStatsError(null);
      
      const url = `${apiUrl}/api/admin/properties/stats`;
      
      const response = await axios.get(url, { withCredentials: true });
      
      console.log("Property stats response:", response.data);
      if (response.data && response.data.success) {
        setPropertyStats(response.data.data || null);
        
        const successMessage = response.data.message || "Property stats loaded successfully!";
        setPropertyStatsSuccess(successMessage);
        
        return response.data;
      }
    } catch (error) {
      console.error("Fetch property stats error:", error);
      if(error.response?.status === 401){
        handle401Error();
        return;
      }
      const errorMessage = error.response?.data?.message || "Failed to fetch property stats. Please try again.";
      
      setPropertyStatsError(errorMessage);
      throw error;
    } finally {
      setPropertyStatsLoading(false);
    }
  };
  
  const fetchRecentProperties = async () => {
    console.log("Fetching recent properties...");
    try {
      setRecentPropertiesLoading(true);
      setRecentPropertiesError(null);
      
      const url = `${apiUrl}/api/admin/properties/recent`;
      
      const response = await axios.get(url, { withCredentials: true });
      
      console.log("Recent properties response:", response.data);
      if (response.data && response.data.success) {
        setRecentProperties(response.data.data || []);
        
        const successMessage = response.data.message || "Recent properties loaded successfully!";
        setRecentPropertiesSuccess(successMessage);
        
        return response.data;
      }
    } catch (error) {
      console.error("Fetch recent properties error:", error);
      if(error.response?.status === 401){
        handle401Error();
        return;
      }
      const errorMessage = error.response?.data?.message || "Failed to fetch recent properties. Please try again.";
      
      setRecentPropertiesError(errorMessage);
      throw error;
    } finally {
      setRecentPropertiesLoading(false);
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
      searchProperties,
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
      
      // Add property states
      addProperty,
      // Add property loading states
      addPropertyLoading,
      // Add property error states
      addPropertyError,
      // Add property success states
      addPropertySuccess,
      // Clear add property methods
      clearAddPropertyError,
      
      // Update property states
      updateProperty,
      // Update property loading states
      updatePropertyLoading,
      // Update property error states
      updatePropertyError,
      // Update property success states
      updatePropertySuccess,
      // Clear update property methods
      clearUpdatePropertyError,
      
      // Delete property states
      deleteProperty,
      // Delete property loading states
      deletePropertyLoading,
      // Delete property error states
      deletePropertyError,
      // Delete property success states
      deletePropertySuccess,
      // Clear delete property methods
      clearDeletePropertyError,
      
      // Cover images states
      coverImages,
      setCoverImages,
      fetchCoverImages,
      // Cover images loading states
      coverImagesLoading,
      // Cover images error states
      coverImagesError,
      // Cover images success states
      coverImagesSuccess,
      // Clear cover images methods
      clearCoverImagesError,
      
      // Property stats states
      propertyStats,
      setPropertyStats,
      fetchPropertyStats,
      // Property stats loading states
      propertyStatsLoading,
      // Property stats error states
      propertyStatsError,
      // Property stats success states
      propertyStatsSuccess,
      // Clear property stats methods
      clearPropertyStatsError,
      
      // Recent properties states
      recentProperties,
      setRecentProperties,
      fetchRecentProperties,
      // Recent properties loading states
      recentPropertiesLoading,
      // Recent properties error states
      recentPropertiesError,
      // Recent properties success states
      recentPropertiesSuccess,
      // Clear recent properties methods
      clearRecentPropertiesError,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyProvider;
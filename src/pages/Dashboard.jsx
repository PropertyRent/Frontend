import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../stores/authStore";
import { PropertyContext } from "../stores/propertyStore";

// Dashboard Components
import Sidebar from "../components/Dashboard/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardOverview from "../components/Dashboard/DashboardOverview";
import PropertiesSection from "../components/Dashboard/PropertiesSection";
import PreScreeningSection from "../components/Dashboard/PreScreeningSection";
import SettingsSection from "../components/Dashboard/SettingsSection";
import ContactSection from "../components/Dashboard/ContactSection";
import ContactManagement from "../components/Dashboard/ContactManagement";
import TeamManagement from "../components/Dashboard/TeamManagement";
import ApplicationManagement from "../components/Dashboard/ApplicationManagement";
import ScreeningManagement from "../components/Dashboard/ScreeningManagement";
import NoticeManagement from "../components/Dashboard/NoticeManagement";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");




  const [questionForm, setQuestionForm] = useState({
    question: "",
    type: "text",
    required: true,
    placeholder: "",
    options: []
  });

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [query, setQuery] = useState("");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    email: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const profilePhotoInputRef = useRef(null);

  const { navigate, user } = useContext(AuthContext);
  const { 
    profile, 
    getProfile, 
    updateProfile,
  } = useContext(PropertyContext);

  useEffect(() => {
    if (!user) {
      navigate("/admin-login");
    } else {
      // Fetch profile when user is authenticated and settings section is active
      if (activeSection === "settings") {
        handleGetProfile();
      }
      if(activeSection === "contacts") {

      }
    }
  }, [navigate, activeSection]);

  // Update profile form when profile data changes
  useEffect(() => {
    if (profile && profile.user) {
      setProfileForm({
        full_name: profile.user.full_name || '',
        phone: profile.user.phone || '',
        email: profile.user.email || ''
      });
      // Set profile photo preview if exists
      if (profile.user.profile_photo) {
        setProfilePhotoPreview(profile.user.profile_photo);
      }
    }
  }, [profile]);





  function handleQuestionChange(e) {
    const { name, value } = e.target;
    setQuestionForm((f) => ({ ...f, [name]: value }));
  }

  function resetQuestionForm() {
    setQuestionForm({
      question: "",
      type: "text",
      required: true,
      placeholder: "",
      options: []
    });
    setEditingQuestion(null);
  }

  // Pre-Screening Questions Functions
  function handleQuestionSubmit(e) {
    e.preventDefault();
    if (!questionForm.question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (editingQuestion) {
      setPreScreeningQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...questionForm, id: editingQuestion.id }
          : q
      ));
      alert("Question updated successfully!");
    } else {
      const newQuestion = {
        id: Date.now(),
        ...questionForm,
        options: questionForm.type === 'select' ? questionForm.options : []
      };
      setPreScreeningQuestions(prev => [...prev, newQuestion]);
      alert("Question added successfully!");
    }
    
    resetQuestionForm();
  }

  function editQuestion(question) {
    setQuestionForm(question);
    setEditingQuestion(question);
  }

  function deleteQuestion(id) {
    if (confirm("Are you sure you want to delete this question?")) {
      setPreScreeningQuestions(prev => prev.filter(q => q.id !== id));
    }
  }

  function addOption() {
    const option = prompt("Enter option text:");
    if (option && option.trim()) {
      setQuestionForm(prev => ({
        ...prev,
        options: [...prev.options, option.trim()]
      }));
    }
  }

  function removeOption(index) {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  }

  // Profile Management Functions
  const handleGetProfile = async () => {
    try {
      getProfile();
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData with profile data and photo
      const profileData = { ...profileForm };
      
      // Add profile photo if selected
      if (profilePhoto) {
        profileData.profile_photo = profilePhoto;
      }
      
      updateProfile(profileData);
      setIsEditingProfile(false);
      setProfilePhoto(null);
      if (profilePhotoInputRef.current) {
        profilePhotoInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (profile && profile.user) {
      setProfileForm({
        full_name: profile.user.full_name || '',
        phone: profile.user.phone || '',
        email: profile.user.email || ''
      });
      // Reset profile photo
      setProfilePhotoPreview(profile.user.profile_photo || null);
    }
    setProfilePhoto(null);
    setIsEditingProfile(false);
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = null;
    }
  };

  // Profile photo handlers
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Profile photo must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      setProfilePhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = null;
    }
  };


  // Use real properties from PropertyContext, fallback to local mock data for other sections
  // const currentProperties = activeSection === "properties" ? properties : [];
  // console.log("Current Properties:", currentProperties);

  


  // Filter properties based on search query
  // const filtered = currentProperties.filter(
  //   (p) =>
  //     p.title.toLowerCase().includes(query.toLowerCase()) ||
  //     (p.location && p.location.toLowerCase().includes(query.toLowerCase())) ||
  //     (p.city && p.city.toLowerCase().includes(query.toLowerCase())) ||
  //     (p.address && p.address.toLowerCase().includes(query.toLowerCase()))
  // );

  return (
    <div className="min-h-screen font-sans bg-[var(--color-bg)]">
      <div className="flex">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 max-h-screen overflow-auto">
          <div className="p-8">
            <DashboardHeader 
              activeSection={activeSection}
              query={query}
              setQuery={setQuery}
            />

            {/* Dashboard Content */}
            {activeSection === "dashboard" && (
              <DashboardOverview 
                onNavigateToContacts={() => setActiveSection("contacts")}
                onNavigateToTeam={() => setActiveSection("team")}
              />
            )}

            {/* Properties Section */}
            {activeSection === "properties" && (
              <PropertiesSection />
            )}

            

            {/* Pre-Screening Management Section */}
            {activeSection === "pre-screening" && (
              <ScreeningManagement />
            )}

            {activeSection === "contacts" && (
              <ContactManagement />
            )}

            {/* Team Management Section */}
            {activeSection === "team" && (
              <TeamManagement />
            )}

            {/* Application Management Section */}
            {activeSection === "applications" && (
              <ApplicationManagement />
            )}

            {/* Notice Management Section */}
            {activeSection === "notices" && (
              <NoticeManagement />
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <SettingsSection 
                profileForm={profileForm}
                isEditingProfile={isEditingProfile}
                handleProfileChange={handleProfileChange}
                handleProfileSubmit={handleProfileSubmit}
                handleEditProfile={handleEditProfile}
                handleCancelEdit={handleCancelEdit}
                handleGetProfile={handleGetProfile}
                profilePhoto={profilePhoto}
                profilePhotoPreview={profilePhotoPreview}
                profilePhotoInputRef={profilePhotoInputRef}
                handleProfilePhotoChange={handleProfilePhotoChange}
                handleRemoveProfilePhoto={handleRemoveProfilePhoto}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import AddPropertyForm from "./AddPropertyForm";
import EditPropertyForm from "./EditPropertyForm";
import PropertyList from "./PropertyList";

const PropertiesSection = ({ 
  form, 
  handleChange, 
  resetForm, 
  images, 
  imagePreviews, 
  handleFileSelect, 
  removeImage, 
  filtered, 
  deleteProperty 
}) => {
  const [editingProperty, setEditingProperty] = useState(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setIsFormExpanded(true);
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setIsFormExpanded(false);
  };

  const toggleFormExpansion = () => {
    setIsFormExpanded(!isFormExpanded);
  };

  return (
    <div className="space-y-6">
      <div className={`grid gap-6 transition-all duration-300 ${
        isFormExpanded ? 'lg:grid-cols-5' : 'lg:grid-cols-3'
      }`}>
        <div className={`transition-all duration-300 ${
          isFormExpanded ? 'lg:col-span-3' : 'lg:col-span-1'
        }`}>
          {editingProperty ? (
            <EditPropertyForm 
              property={editingProperty}
              onCancel={handleCancelEdit}
              isExpanded={isFormExpanded}
            />
          ) : (
            <AddPropertyForm 
              form={form}
              handleChange={handleChange}
              resetForm={resetForm}
              images={images}
              imagePreviews={imagePreviews}
              handleFileSelect={handleFileSelect}
              removeImage={removeImage}
              isExpanded={isFormExpanded}
              onToggleExpansion={toggleFormExpansion}
            />
          )}
        </div>
        <div className={`transition-all duration-300 ${
          isFormExpanded ? 'lg:col-span-2' : 'lg:col-span-2'
        }`}>
          <PropertyList 
            filtered={filtered}
            deleteProperty={deleteProperty}
            onEditProperty={handleEditProperty}
            isCompact={isFormExpanded}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesSection;
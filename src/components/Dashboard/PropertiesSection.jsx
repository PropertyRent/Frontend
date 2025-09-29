import AddPropertyForm from "./AddPropertyForm";
import PropertyList from "./PropertyList";

const PropertiesSection = ({ 
  form, 
  handleChange, 
  handleSubmit, 
  resetForm, 
  images, 
  imagePreviews, 
  handleFileSelect, 
  removeImage, 
  filtered, 
  deleteProperty 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <AddPropertyForm 
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          images={images}
          imagePreviews={imagePreviews}
          handleFileSelect={handleFileSelect}
          removeImage={removeImage}
        />
        <PropertyList 
          filtered={filtered}
          deleteProperty={deleteProperty}
        />
      </div>
    </div>
  );
};

export default PropertiesSection;
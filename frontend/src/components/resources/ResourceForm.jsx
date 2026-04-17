import { useEffect, useState } from "react";
import "./ResourceForm.css";

const defaultFormState = {
  name: "",
  type: "",
  description: "",
  location: "",
  capacity: "",
  available: true,
  imageUrl: "",
};

const ResourceForm = ({
  onSubmit,
  selectedResource,
  onCancel,
  isSubmitting = false,
  serverErrors = {},
}) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (selectedResource) {
      setFormData({
        name: selectedResource.name || "",
        type: selectedResource.type || "",
        description: selectedResource.description || "",
        location: selectedResource.location || "",
        capacity: selectedResource.capacity ?? "",
        available:
          selectedResource.available !== undefined
            ? selectedResource.available
            : true,
        imageUrl: selectedResource.imageUrl || "",
      });
      setPreview(selectedResource.imageUrl || "");
    } else {
      setFormData(defaultFormState);
      setPreview("");
    }

    setSelectedFile(null);
    setErrors({});
  }, [selectedResource]);

  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...serverErrors,
      }));
    }
  }, [serverErrors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "imageUrl") {
      setPreview(value.trim());
      if (value.trim()) {
        setSelectedFile(null);
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      imageFile: name === "imageUrl" ? "" : prev.imageFile,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setPreview(formData.imageUrl.trim() || "");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    const newErrors = {};

    if (!allowedTypes.includes(file.type)) {
      newErrors.imageFile =
        "Only JPG, JPEG, PNG, or WEBP images are allowed";
    } else if (file.size > maxSize) {
      newErrors.imageFile = "Image size must be 5MB or less";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));

    setErrors((prev) => ({
      ...prev,
      imageUrl: "",
      imageFile: "",
    }));
  };

  const validateImageUrl = (url) => {
    if (!url.trim()) return true;

    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const type = formData.type.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const imageUrl = formData.imageUrl.trim();

    if (!name) {
      newErrors.name = "Resource name is required";
    } else if (name.length < 3) {
      newErrors.name = "Resource name must be at least 3 characters";
    } else if (name.length > 100) {
      newErrors.name = "Resource name must be less than 100 characters";
    }

    if (!type) {
      newErrors.type = "Type is required";
    } else if (type.length < 2) {
      newErrors.type = "Type must be at least 2 characters";
    } else if (type.length > 50) {
      newErrors.type = "Type must be less than 50 characters";
    }

    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!location) {
      newErrors.location = "Location is required";
    } else if (location.length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    } else if (location.length > 100) {
      newErrors.location = "Location must be less than 100 characters";
    }

    if (formData.capacity === "" || formData.capacity === null) {
      newErrors.capacity = "Capacity is required";
    } else if (Number.isNaN(Number(formData.capacity))) {
      newErrors.capacity = "Capacity must be a valid number";
    } else if (!Number.isInteger(Number(formData.capacity))) {
      newErrors.capacity = "Capacity must be a whole number";
    } else if (Number(formData.capacity) < 0) {
      newErrors.capacity = "Capacity cannot be negative";
    } else if (Number(formData.capacity) > 10000) {
      newErrors.capacity = "Capacity is too large";
    }

    if (imageUrl && !validateImageUrl(imageUrl)) {
      newErrors.imageUrl =
        "Please enter a valid image URL starting with http or https";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    const payload = {
      ...formData,
      name: formData.name.trim(),
      type: formData.type.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      imageUrl: formData.imageUrl.trim(),
      capacity: Number(formData.capacity),
    };

    onSubmit(payload, selectedFile);
  };

  return (
    <div className="resource-form-wrapper">
      <form onSubmit={handleSubmit} className="resource-form" noValidate>
        <div className="resource-form__grid">
          <div className="resource-form__field">
            <label>Resource Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter resource name"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="resource-form__field">
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Enter resource type"
            />
            {errors.type && <p className="form-error">{errors.type}</p>}
          </div>
        </div>

        <div className="resource-form__field">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows="4"
          />
          {errors.description && (
            <p className="form-error">{errors.description}</p>
          )}
        </div>

        <div className="resource-form__grid">
          <div className="resource-form__field">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>

          <div className="resource-form__field">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
              min="0"
              step="1"
            />
            {errors.capacity && <p className="form-error">{errors.capacity}</p>}
          </div>
        </div>

        <div className="resource-form__field">
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          {errors.imageUrl && <p className="form-error">{errors.imageUrl}</p>}
        </div>

        <div className="resource-form__field">
          <label>Or Choose from Device</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
          {errors.imageFile && <p className="form-error">{errors.imageFile}</p>}
        </div>

        {preview && (
          <div className="resource-form__field">
            <label>Image Preview</label>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "220px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
        )}

        <div className="resource-form__checkbox">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <label htmlFor="available">Available</label>
        </div>

        <div className="resource-form__actions">
          <button
            type="submit"
            className="resource-form__btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : selectedResource
              ? "Update Resource"
              : "Create Resource"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="resource-form__btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
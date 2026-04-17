import { useEffect, useState } from "react";
import {
  createResource,
  deleteResource,
  getAllResources,
  updateResource,
  uploadImage,
} from "../api/resourceApi";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceForm from "../components/resources/ResourceForm";
import "./AdminResourcesPage.css";

const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [viewingResource, setViewingResource] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const normalizeResource = (resource) => ({
    ...resource,
    id: resource?.id || resource?._id,
  });

  const loadResources = async () => {
    try {
      const data = await getAllResources();
      const resourceList = Array.isArray(data) ? data : data?.data || [];
      setResources(resourceList.map(normalizeResource));
    } catch (error) {
      console.error("Failed to load admin resources:", error);
      setResources([]);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleAddNew = () => {
    setSelectedResource(null);
    setServerErrors({});
    setShowForm(true);
  };

  const handleEdit = (resource) => {
    setSelectedResource(normalizeResource(resource));
    setServerErrors({});
    setShowForm(true);
  };

  const handleView = (resource) => {
    setViewingResource(normalizeResource(resource));
  };

  const handleSubmit = async (payload, file = null) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setServerErrors({});

      let finalPayload = { ...payload };

      if (file) {
        const uploadedUrl = await uploadImage(file);
        finalPayload.imageUrl = uploadedUrl;
      }

      if (selectedResource?.id) {
        await updateResource(selectedResource.id, finalPayload);
      } else {
        await createResource(finalPayload);
      }

      setSelectedResource(null);
      setShowForm(false);
      await loadResources();
    } catch (error) {
      console.error("Failed to save resource:", error);

      const responseData = error?.response?.data;

      if (responseData?.errors) {
        setServerErrors(responseData.errors);
      } else {
        alert(responseData?.message || "Failed to save resource");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmed) return;

    try {
      await deleteResource(id);
      await loadResources();

      if (viewingResource?.id === id) {
        setViewingResource(null);
      }
    } catch (error) {
      console.error("Failed to delete resource:", error);
      alert(error?.response?.data?.message || "Failed to delete resource");
    }
  };

  const handleCancel = () => {
    setSelectedResource(null);
    setShowForm(false);
    setServerErrors({});
  };

  return (
    <div className="admin-resources-page">
      <div className="admin-resources-header">
        <div>
          <p className="admin-resources-eyebrow">Admin Workspace</p>
          <h1 className="admin-resources-title">Manage Resources</h1>
          <p className="admin-resources-subtitle">
            Add, update, review, and maintain campus resources from one place.
          </p>
        </div>

        <button onClick={handleAddNew} className="add-resource-btn">
          Add New Resource
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card fade-in">
          <h2 className="admin-form-title">
            {selectedResource ? "Edit Resource" : "Add New Resource"}
          </h2>

          <ResourceForm
            onSubmit={handleSubmit}
            selectedResource={selectedResource}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            serverErrors={serverErrors}
          />
        </div>
      )}

      {viewingResource && (
        <div
          className="resource-modal-overlay"
          onClick={() => setViewingResource(null)}
        >
          <div className="resource-modal" onClick={(e) => e.stopPropagation()}>
            <div className="resource-modal__header">
              <div>
                <p className="resource-modal__eyebrow">Resource Details</p>
                <h2>{viewingResource.name || "N/A"}</h2>
              </div>
              <button
                className="resource-modal__close"
                onClick={() => setViewingResource(null)}
              >
                ×
              </button>
            </div>

            <div className="resource-modal__content">
              {viewingResource.imageUrl && (
                <div className="resource-modal__image-wrap">
                  <img
                    src={viewingResource.imageUrl}
                    alt={viewingResource.name}
                    className="resource-modal__image"
                  />
                </div>
              )}

              <div className="resource-modal__detail-grid">
                <div className="resource-modal__detail-card">
                  <span>Type</span>
                  <p>{viewingResource.type || "N/A"}</p>
                </div>

                <div className="resource-modal__detail-card">
                  <span>Status</span>
                  <p>
                    {viewingResource.available ? "Available" : "Unavailable"}
                  </p>
                </div>

                <div className="resource-modal__detail-card">
                  <span>Location</span>
                  <p>{viewingResource.location || "N/A"}</p>
                </div>

                <div className="resource-modal__detail-card">
                  <span>Capacity</span>
                  <p>{viewingResource.capacity ?? "N/A"}</p>
                </div>
              </div>

              <div className="resource-modal__description">
                <span>Description</span>
                <p>
                  {viewingResource.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="resources-grid">
        {resources.length > 0 ? (
          resources.map((resource, index) => (
            <ResourceCard
              key={resource.id || resource._id || `${resource.name}-${index}`}
              resource={resource}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin
            />
          ))
        ) : (
          <p className="empty-text">No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminResourcesPage;
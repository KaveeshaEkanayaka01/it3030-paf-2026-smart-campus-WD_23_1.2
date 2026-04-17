import { useEffect, useMemo, useState } from "react";
import { getAllResources } from "../api/resourceApi";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceFilter from "../components/resources/ResourceFilter";
import Loader from "../components/common/Loader";
import "./ResourcesPage.css";

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [viewingResource, setViewingResource] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        const normalizedResources = (Array.isArray(data) ? data : []).map(
          (resource) => ({
            ...resource,
            id: resource.id || resource._id,
          })
        );
        setResources(normalizedResources);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        !search ||
        resource?.name?.toLowerCase().includes(search.toLowerCase()) ||
        resource?.location?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        !type || resource?.type?.toLowerCase().includes(type.toLowerCase());

      const matchesAvailability = !availableOnly || resource?.available === true;

      return matchesSearch && matchesType && matchesAvailability;
    });
  }, [resources, search, type, availableOnly]);

  const totalResources = resources.length;
  const totalAvailable = resources.filter((r) => r.available).length;
  const totalUnavailable = resources.filter((r) => !r.available).length;

  const handleView = (resource) => {
    setViewingResource(resource);
  };

  const handleCloseView = () => {
    setViewingResource(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="resources-page">
      <div className="resources-page__hero">
        <div>
          <p className="resources-page__eyebrow">Campus Resource Hub</p>
          <h1>Browse Resources</h1>
          <p className="resources-page__subtitle">
            Discover rooms, labs, halls, and equipment available across the
            campus.
          </p>
        </div>

        <div className="resources-page__summary">
          <div className="summary-card">
            <span>Total Resources</span>
            <strong>{totalResources}</strong>
          </div>
          <div className="summary-card">
            <span>Available Now</span>
            <strong>{totalAvailable}</strong>
          </div>
          <div className="summary-card summary-card--muted">
            <span>Unavailable</span>
            <strong>{totalUnavailable}</strong>
          </div>
        </div>
      </div>

      <ResourceFilter
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
      />

      {filteredResources.length === 0 ? (
        <div className="resources-empty">
          <h3>No resources found</h3>
          <p>Try changing the search text or filter options.</p>
        </div>
      ) : (
        <div className="resources-grid">
          {filteredResources.map((resource, index) => (
            <ResourceCard
              key={resource.id || resource._id || `${resource.name}-${index}`}
              resource={resource}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {viewingResource && (
        <div className="resource-modal-overlay" onClick={handleCloseView}>
          <div
            className="resource-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resource-modal__header">
              <div>
                <p className="resource-modal__eyebrow">Resource Details</p>
                <h2>{viewingResource.name || "N/A"}</h2>
              </div>
              <button
                className="resource-modal__close"
                onClick={handleCloseView}
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

              <div className="resource-modal__details">
                <div className="resource-modal__detail-grid">
                  <div className="resource-modal__detail-card">
                    <span>Type</span>
                    <p>{viewingResource.type || "N/A"}</p>
                  </div>

                  <div className="resource-modal__detail-card">
                    <span>Status</span>
                    <p>{viewingResource.available ? "Available" : "Unavailable"}</p>
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
                  <p>{viewingResource.description || "No description available."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
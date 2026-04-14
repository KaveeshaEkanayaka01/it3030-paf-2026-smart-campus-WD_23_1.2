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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(Array.isArray(data) ? data : []);
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
        resource?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        !type || resource?.type?.toLowerCase().includes(type.toLowerCase());

      const matchesAvailability =
        !availableOnly || resource?.available === true;

      return matchesSearch && matchesType && matchesAvailability;
    });
  }, [resources, search, type, availableOnly]);

  if (loading) return <Loader />;

  return (
    <div className="resources-page">
      <div className="resources-page__header">
        <div>
          <h1>Resources</h1>
          <p>Browse and check available campus resources.</p>
        </div>

        <div className="resources-page__summary">
          <div className="summary-card">
            <span>Total Resources</span>
            <strong>{resources.length}</strong>
          </div>
          <div className="summary-card">
            <span>Available Now</span>
            <strong>{resources.filter((r) => r.available).length}</strong>
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
          <p>Try changing your search or filter options.</p>
        </div>
      ) : (
        <div className="resources-grid">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id || resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
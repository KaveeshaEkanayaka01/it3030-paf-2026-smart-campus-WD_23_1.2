import { useEffect, useState } from "react";
import {
  createResource,
  deleteResource,
  getAllResources,
  updateResource,
} from "../api/resourceApi";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceForm from "../components/resources/ResourceForm";

const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);

  const loadResources = async () => {
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (error) {
      console.error("Failed to load admin resources:", error);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      if (selectedResource) {
        await updateResource(selectedResource.id, payload);
      } else {
        await createResource(payload);
      }

      setSelectedResource(null);
      loadResources();
    } catch (error) {
      console.error("Failed to save resource:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      loadResources();
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Manage Resources</h1>

      <ResourceForm
        onSubmit={handleSubmit}
        selectedResource={selectedResource}
        onCancel={() => setSelectedResource(null)}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onEdit={setSelectedResource}
            onDelete={handleDelete}
            isAdmin
          />
        ))}
      </div>
    </div>
  );
};

export default AdminResourcesPage;
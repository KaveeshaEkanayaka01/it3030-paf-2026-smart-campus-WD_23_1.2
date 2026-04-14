import { useEffect, useState } from "react";
import { getAllResources, getAvailableResources, getResourcesByType, searchResources } from "../api/resourceApi";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceFilter from "../components/resources/ResourceFilter";

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const loadResources = async () => {
    try {
      let data = [];

      if (keyword.trim()) {
        data = await searchResources(keyword);
      } else if (type.trim()) {
        data = await getResourcesByType(type);
      } else if (showAvailableOnly) {
        data = await getAvailableResources();
      } else {
        data = await getAllResources();
      }

      setResources(data);
    } catch (error) {
      console.error("Failed to load resources:", error);
    }
  };

  useEffect(() => {
    loadResources();
  }, [keyword, type, showAvailableOnly]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Resources</h1>

      <ResourceFilter
        keyword={keyword}
        setKeyword={setKeyword}
        type={type}
        setType={setType}
        showAvailableOnly={showAvailableOnly}
        setShowAvailableOnly={setShowAvailableOnly}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
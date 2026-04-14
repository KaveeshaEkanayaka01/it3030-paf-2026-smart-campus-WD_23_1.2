import "./ResourceFilter.css";

const ResourceFilter = ({
  search,
  setSearch,
  type,
  setType,
  availableOnly,
  setAvailableOnly,
}) => {
  return (
    <div className="resource-filter">
      <div className="resource-filter__group">
        <input
          type="text"
          placeholder="Search resource name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by type..."
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>

      <label className="resource-filter__checkbox">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => setAvailableOnly(e.target.checked)}
        />
        <span>Show available only</span>
      </label>
    </div>
  );
};

export default ResourceFilter;
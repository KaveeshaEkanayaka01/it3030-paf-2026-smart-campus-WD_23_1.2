const ResourceFilter = ({
  keyword,
  setKeyword,
  type,
  setType,
  showAvailableOnly,
  setShowAvailableOnly,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 grid md:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="Search resource name..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border rounded-lg px-4 py-3"
      />

      <input
        type="text"
        placeholder="Filter by type..."
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded-lg px-4 py-3"
      />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={showAvailableOnly}
          onChange={(e) => setShowAvailableOnly(e.target.checked)}
        />
        Show available only
      </label>
    </div>
  );
};

export default ResourceFilter;
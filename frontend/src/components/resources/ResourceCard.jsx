const ResourceCard = ({ resource, onEdit, onDelete, isAdmin = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 space-y-3">
      {resource.imageUrl && (
        <img
          src={resource.imageUrl}
          alt={resource.name}
          className="w-full h-44 object-cover rounded-lg"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
          <p className="text-sm text-gray-500">{resource.type}</p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            resource.available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {resource.available ? "Available" : "Unavailable"}
        </span>
      </div>

      <p className="text-sm text-gray-600">{resource.description}</p>

      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-semibold">Location:</span> {resource.location}</p>
        <p><span className="font-semibold">Capacity:</span> {resource.capacity}</p>
      </div>

      {isAdmin && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(resource)}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(resource.id)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
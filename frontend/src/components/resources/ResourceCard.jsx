import StatusBadge from "../common/StatusBadge";
import "./ResourceCard.css";

const ResourceCard = ({
  resource,
  onView,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const resourceId = resource?.id || resource?._id;

  return (
    <div className="resource-card">
      {resource?.imageUrl ? (
        <div className="resource-card__image-wrap">
          <img
            src={resource.imageUrl}
            alt={resource.name}
            className="resource-card__image"
          />
        </div>
      ) : (
        <div className="resource-card__image-placeholder">
          <span>{resource?.type || "Resource"}</span>
        </div>
      )}

      <div className="resource-card__content">
        <div className="resource-card__top">
          <div>
            <h3>{resource?.name || "Unnamed Resource"}</h3>
            <p>{resource?.type || "Unknown Type"}</p>
          </div>

          <StatusBadge
            status={resource?.available ? "Available" : "Unavailable"}
          />
        </div>

        <div className="resource-card__body">
          <div className="resource-card__info">
            <span>Description</span>
            <p>{resource?.description || "No description available."}</p>
          </div>

          <div className="resource-card__meta">
            <div>
              <span>Location</span>
              <p>{resource?.location || "N/A"}</p>
            </div>

            <div>
              <span>Capacity</span>
              <p>{resource?.capacity ?? "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="resource-card__footer">
          <button
            className="resource-card__btn"
            onClick={() => onView?.(resource)}
          >
            View Details
          </button>

          {isAdmin && (
            <div className="resource-card__admin-actions">
              <button
                className="resource-card__btn resource-card__btn--edit"
                onClick={() => onEdit?.(resource)}
              >
                Edit
              </button>

              <button
                className="resource-card__btn resource-card__btn--delete"
                onClick={() => onDelete?.(resourceId)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
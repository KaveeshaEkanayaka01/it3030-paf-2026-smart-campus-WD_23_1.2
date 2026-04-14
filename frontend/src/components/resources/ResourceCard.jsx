import StatusBadge from "../common/StatusBadge";
import "./ResourceCard.css";

const ResourceCard = ({ resource }) => {
  return (
    <div className="resource-card">
      <div className="resource-card__top">
        <div>
          <h3>{resource?.name || "Unnamed Resource"}</h3>
          <p>{resource?.type || "Unknown Type"}</p>
        </div>

        <StatusBadge status={resource?.available ? "Available" : "Unavailable"} />
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
        <button className="resource-card__btn">View Details</button>
      </div>
    </div>
  );
};

export default ResourceCard;
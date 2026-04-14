import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  let className = "status-badge";

  if (
    normalized === "approved" ||
    normalized === "available" ||
    normalized === "resolved"
  ) {
    className += " status-badge--success";
  } else if (
    normalized === "pending" ||
    normalized === "in-progress"
  ) {
    className += " status-badge--warning";
  } else if (
    normalized === "rejected" ||
    normalized === "cancelled" ||
    normalized === "unavailable"
  ) {
    className += " status-badge--danger";
  } else {
    className += " status-badge--default";
  }

  return <span className={className}>{status || "N/A"}</span>;
};

export default StatusBadge;
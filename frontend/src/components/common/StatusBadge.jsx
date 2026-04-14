import React from "react";

const StatusBadge = ({ status }) => {
  const getColor = () => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "available":
      case "resolved":
        return "bg-green-100 text-green-700";

      case "pending":
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
      case "cancelled":
      case "unavailable":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getColor()}`}
    >
      {status || "N/A"}
    </span>
  );
};

export default StatusBadge;
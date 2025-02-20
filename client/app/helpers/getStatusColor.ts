export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-500";
    case "in-progress":
      return "text-blue-500";
    case "completed":
      return "text-green-500";
    case "declined":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

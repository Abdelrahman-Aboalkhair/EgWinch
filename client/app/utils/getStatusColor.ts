export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-700 bg-yellow-100/90";
    case "in-progress":
      return "text-blue-600 bg-blue-100";
    case "completed":
    case "accepted":
      return "text-green-600 bg-green-100";
    case "declined":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

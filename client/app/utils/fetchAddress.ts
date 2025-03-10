import axiosInstance from "./axiosInstance";

const fetchAddress = async (lat: number, lng: number) => {
  try {
    const response = await axiosInstance.get(
      `/locations/geocode/reverse?lat=${lat}&lon=${lng}`
    );
    console.log("response: ", response);
    return response.data.display_name;
  } catch (error) {
    console.error("Failed to fetch address:", error);
    return "Unknown Location";
  }
};

export default fetchAddress;

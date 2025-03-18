"use client";
import { useGetProfileQuery } from "@/app/store/apis/UserApi";
import { useParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetUserReviewsQuery,
} from "@/app/store/apis/ReviewApi";
import { Circle } from "lucide-react";

interface Review {
  _id: string;
  reviewer: string;
  reviewedUser: string;
  booking?: string;
  rating: number;
  text: string;
}

const Profile = () => {
  const { id } = useParams();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetProfileQuery(id);
  const { data: reviews, isLoading: reviewsLoading } =
    useGetUserReviewsQuery(id);
  const [createReview, { isLoading: createReviewLoading }] =
    useCreateReviewMutation();
  const [deleteReview, { isLoading: deleteReviewLoading }] =
    useDeleteReviewMutation();

  const { register, handleSubmit, reset } = useForm();

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (userError || !userData?.user) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error loading profile
      </div>
    );
  }

  const {
    name,
    email,
    phoneNumber,
    role,
    location,
    driverLicenseNumber,
    driverLicenseExpiry,
    registrationNumber,
    registrationExpiry,
    capacity,
    availabilityStatus,
  } = userData.user;

  const isDriver = role === "driver";

  // ✅ Handle Review Submission
  const onSubmitReview = async (data) => {
    try {
      await createReview({
        reviewedUserId: id,
        rating: data.rating,
        text: data.text,
      }).unwrap();
      reset();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex items-center space-x-4">
        <Circle className="text-gray-600 text-5xl" />
        <div>
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-gray-500">
            {isDriver ? "Winch Driver" : "Customer"}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t pt-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Contact Information
        </h3>
        <div className="mt-2 space-y-2">
          <p className="flex items-center text-gray-600">
            <Circle className="mr-2 text-blue-500" /> {phoneNumber}
          </p>
          <p className="flex items-center text-gray-600">
            <Circle className="mr-2 text-red-500" /> {email}
          </p>
          <p className="flex items-center text-gray-600">
            <Circle className="mr-2 text-green-500" /> Location:{" "}
            {location?.coordinates.join(", ")}
          </p>
        </div>
      </div>

      {isDriver && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Driver Information
          </h3>
          <div className="mt-2 space-y-2">
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-yellow-500" /> Completed Moves: 12
            </p>
            <p className="text-gray-600">Rating: ⭐⭐⭐⭐☆ (4.5)</p>
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-purple-500" /> License Number:{" "}
              {driverLicenseNumber}
            </p>
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-gray-500" /> License Expiry:{" "}
              {new Date(driverLicenseExpiry).toLocaleDateString()}
            </p>
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-blue-400" /> Registration Number:{" "}
              {registrationNumber}
            </p>
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-gray-500" /> Registration Expiry:{" "}
              {new Date(registrationExpiry).toLocaleDateString()}
            </p>
            <p className="flex items-center text-gray-600">
              <Circle className="mr-2 text-orange-500" /> Vehicle Capacity:{" "}
              {capacity}
            </p>
            <p className="text-gray-600">
              <strong>Availability:</strong> {availabilityStatus}
            </p>
          </div>

          <Link href={`/chat/${userData.user._id}`}>
            <button className="bg-primary px-4 text-white rounded-md py-2 text-[15px] font-medium mt-3">
              Contact
            </button>
          </Link>
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Customer Reviews
        </h3>

        {/* Reviews List */}
        <div className="mt-2 space-y-3">
          {reviewsLoading ? (
            <p className="text-gray-400">Loading reviews...</p>
          ) : reviews?.length > 0 ? (
            reviews.map((review: Review) => (
              <div
                key={review._id}
                className="flex justify-between items-center text-gray-600"
              >
                <div>
                  <strong>{review.reviewer}:</strong> {review.text}{" "}
                  <span className="text-yellow-500">
                    {"⭐".repeat(review.rating)}
                  </span>
                </div>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => handleDeleteReview(review._id)}
                  disabled={deleteReviewLoading}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmitReview)} className="mt-4">
          <textarea
            className="w-full p-2 border rounded-md"
            rows={2}
            placeholder="Write a review..."
            {...register("text", { required: true })}
          />
          <input
            type="number"
            className="w-full p-2 border rounded-md mt-2"
            placeholder="Rating (1-5)"
            {...register("rating", { required: true, min: 1, max: 5 })}
          />
          <button
            type="submit"
            className="bg-secondary text-black px-4 py-2 rounded-md mt-2"
            disabled={createReviewLoading}
          >
            {createReviewLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

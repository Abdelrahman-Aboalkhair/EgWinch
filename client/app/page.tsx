"use client";
import BookMove from "./components/booking/BookMove";
import Conversations from "./components/Conversations";
import { useAppSelector } from "./libs/hooks";

const Home = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  return (
    <>
      <BookMove />
      {isLoggedIn && <Conversations />}
    </>
  );
};

export default Home;

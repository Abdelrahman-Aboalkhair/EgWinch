"use client";
import BookMove from "./components/sections/booking/BookMove";
import Conversations from "./components/sections/chat/Conversations";
import { useAppSelector } from "./store/hooks";

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

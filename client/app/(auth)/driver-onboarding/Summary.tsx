import Button from "@/app/components/atoms/Button";
import Link from "next/link";
import React from "react";

const Summary = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold">
        Your application is currently under review
      </h1>
      <p>
        There&apos;s no need to make any changes at this time, feel free to
        contact us if you have any questions.
      </p>
      <Button className="border-2 border-primary text-primary font-medium">
        <Link href={"/contact"}>Contact Support</Link>
      </Button>
    </>
  );
};

export default Summary;

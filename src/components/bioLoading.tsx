import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

const Loading = () => {
  return (
    <div className="text-lg border-2 bg-neutral text-white rounded-lg p-8 py-4 flex gap-4 mx-auto">
      <BiLoaderCircle className="text-3xl animate-spin" /> Loading...
    </div>
  );
};

export default Loading;
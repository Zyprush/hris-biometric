import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

const Loading = () => {
  return (
    <div className="flex gap-2 font-semibold text-lg border-2 bg-neutral text-white rounded-lg p-6 pr-8 py-3 mx-auto">
      <span className="loading loading-spinner loading-sm"></span> Loading...
    </div>
  );
};

export default Loading;
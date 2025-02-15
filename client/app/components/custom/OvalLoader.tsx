import React from "react";

interface OvalLoaderProps {
  color?: string;
  size?: number;
}

const OvalLoader: React.FC<OvalLoaderProps> = ({
  color = "#606c38",
  size = 50,
}) => {
  const loaderStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderTopColor: color,
  };

  return (
    <div className="oval-loader-container">
      <div className="oval-loader" style={loaderStyle}></div>
    </div>
  );
};

export default OvalLoader;

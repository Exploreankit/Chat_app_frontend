import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-4",
};

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => (
  <div
    className={`${sizeMap[size]} border-[#4f8ef7] border-t-transparent rounded-full animate-spin ${className}`}
  />
);

export default Spinner;

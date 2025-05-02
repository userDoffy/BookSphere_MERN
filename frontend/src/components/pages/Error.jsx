import React from 'react'
import { useLocation } from "react-router-dom";

const Error = () => {
  const location = useLocation();
  const message = location.state?.message || "An unexpected error occurred.";
  return (
    <div>{message}</div>
  )
}

export default Error
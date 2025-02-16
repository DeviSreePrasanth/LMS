import React from "react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if no user data is found
  if (!user) {
    return <Navigate to="/" />;
  }

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {user.name}</h1>
      <img
        src={user.profilePicture}
        alt="Profile"
        style={{ borderRadius: "50%", width: "150px", height: "150px" }}
      />
      <p>Email: {user.email}</p>
      <button onClick={logout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default Profile;

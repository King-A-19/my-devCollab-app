import React from "react";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, signInWithGoogle, logout } = useAuth();
  return (
    <nav className="navbar">
      DevCollab | &nbsp;
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={signInWithGoogle}>Login with Google</button>
      )}
    </nav>
  );
}

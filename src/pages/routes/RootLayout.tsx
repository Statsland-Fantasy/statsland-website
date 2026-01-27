// src/layouts/RootLayout.tsx
import { Outlet } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export function RootLayout() {
  const { isLoading } = useAuth0();

  // Show loading during Auth0 callback processing
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Auth0 Stuff Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

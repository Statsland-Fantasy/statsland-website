// src/layouts/RootLayout.tsx
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "@/components";
import { logPageView } from "@/utils/analytics";

export function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      logPageView(location.pathname + location.search);
    }
  }, [location]);

  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

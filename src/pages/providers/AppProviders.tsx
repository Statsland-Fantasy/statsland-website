import React from "react";
import { Toaster } from "sonner";
import { Auth0Provider } from "./Auth0Provider";
import { AudioProvider } from "./AudioProvider";
import { RouterProvider } from "./RouterProvider";

export function AppProviders(): React.ReactElement {
  return (
    <Auth0Provider>
      <AudioProvider>
        <RouterProvider />
        <Toaster position="bottom-right" />
      </AudioProvider>
    </Auth0Provider>
  );
}

import React from "react";
import { Auth0Provider } from "./Auth0Provider";
import { AudioProvider } from "./AudioProvider";
import { RouterProvider } from "./RouterProvider";

export function AppProviders(): React.ReactElement {
  return (
    <Auth0Provider>
      <AudioProvider>
        <RouterProvider />
      </AudioProvider>
    </Auth0Provider>
  );
}

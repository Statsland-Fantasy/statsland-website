import React from "react";
import {
  AppState,
  Auth0Provider as Auth0ProviderBase,
} from "@auth0/auth0-react";
import { config } from "@/config/env";
import { router } from "./RouterProvider";

interface Auth0ProviderProps {
  children: React.ReactNode;
}

export function Auth0Provider({
  children,
}: Auth0ProviderProps): React.ReactElement {
  const onRedirectCallback = (appState?: AppState) => {
    router.navigate(appState?.returnTo || "/", {
      replace: true,
    });
  };

  return (
    <Auth0ProviderBase
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: config.auth0.audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0ProviderBase>
  );
}

import { Location } from "react-router";

export function getCurrentFullUrl(location: Location): string {
  return (
    window.location.origin + location.pathname + location.search + location.hash
  );
}

export function getCurrentPath(location: Location): string {
  return location.pathname + location.search + location.hash;
}

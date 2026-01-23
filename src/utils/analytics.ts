import ReactGA from "react-ga4";

export const initGA = () => {
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;

  if (measurementId) {
    ReactGA.initialize(measurementId);
  } else {
    console.warn("Google Analytics Measurement ID not found");
  }
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

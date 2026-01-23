import ReactGA from "react-ga4";

const isDevelopment = process.env.NODE_ENV === "development";
const isDebugEnabled = process.env.REACT_APP_GA_DEBUG === "true";

export const initGA = () => {
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn("Google Analytics Measurement ID not found");
    return;
  }

  // Initialize GA with debug options
  ReactGA.initialize(measurementId, {
    gaOptions: {
      debug_mode: isDevelopment && isDebugEnabled,
    },
    gtagOptions: {
      debug_mode: isDevelopment && isDebugEnabled,
    },
  });

  if (isDevelopment && isDebugEnabled) {
    console.log("[GA] Google Analytics initialized in DEBUG mode");
    console.log("[GA] Measurement ID:", measurementId);
  }
};

export const logPageView = (path: string) => {
  if (isDevelopment && isDebugEnabled) {
    console.log("[GA] Page View:", path);
  }
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (category: string, action: string, label?: string) => {
  if (isDevelopment && isDebugEnabled) {
    console.log("[GA] Event:", { category, action, label });
  }
  ReactGA.event({
    category,
    action,
    label,
  });
};

// Immediate protection (must be first)
import "./utils/immediateLoadFailedFix";

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./utils/emergencyTextReplacer";
import "./utils/ultimateLoadFailedPrevention";

createRoot(document.getElementById("root")!).render(<App />);

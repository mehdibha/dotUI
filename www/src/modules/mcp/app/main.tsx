import "./app.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { DirectionsCard } from "./directions-card"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DirectionsCard />
  </StrictMode>,
)

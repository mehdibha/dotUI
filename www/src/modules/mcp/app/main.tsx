import "./app.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Card } from "./card"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Card />
  </StrictMode>,
)

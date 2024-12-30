"use client";

import { DevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";

export function Dev() {
  return process.env.NODE_ENV !== "production" && <DevTools />;
}

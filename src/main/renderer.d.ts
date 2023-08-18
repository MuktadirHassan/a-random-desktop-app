import { Api } from "./preload";

// Extend window object with custom properties
declare global {
  interface Window {
    api: Api;
  }
}

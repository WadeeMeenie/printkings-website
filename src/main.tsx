import { StrictMode, Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Print Kings runtime error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <div style={{ maxWidth: 720, width: "100%" }}>
            <p style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".18em", textTransform: "uppercase", color: "#71717a" }}>PRINT KINGS</p>
            <h1 style={{ fontSize: 40, lineHeight: 1, fontWeight: 900, margin: "12px 0" }}>The storefront hit an error.</h1>
            <p style={{ color: "#71717a", lineHeight: 1.6 }}>Refresh the page. If this persists, the error details below identify the failing runtime module.</p>
            <pre style={{ marginTop: 24, padding: 16, overflow: "auto", borderRadius: 16, background: "#f4f4f5", color: "#18181b", fontSize: 13, whiteSpace: "pre-wrap" }}>{this.state.error.message}</pre>
            <button onClick={() => window.location.reload()} style={{ marginTop: 20, border: 0, borderRadius: 999, padding: "12px 20px", background: "#09090b", color: "#fff", fontWeight: 800, cursor: "pointer" }}>REFRESH</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const basename = basePath || undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);

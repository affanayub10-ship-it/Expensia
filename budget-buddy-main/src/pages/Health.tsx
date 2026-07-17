

export default function Health() { return <div style={{ textAlign: "center", padding: "2rem" }}><h1>Health Check</h1><p>OK</p></div>; }

function HealthCheck() {
  const envCheck = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? "âœ… Set" : "âŒ Missing",
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? "âœ… Set" : "âŒ Missing",
    stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? "âœ… Set" : "âŒ Missing",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
      color: "#fff",
      fontFamily: "monospace",
      padding: "2rem"
    }}>
      <div style={{ maxWidth: "600px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>ðŸ¥ Health Check</h1>
        
        <div style={{ background: "#1a1a1a", padding: "1.5rem", borderRadius: "8px", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Environment Variables:</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div>VITE_SUPABASE_URL: {envCheck.supabaseUrl}</div>
            <div>VITE_SUPABASE_ANON_KEY: {envCheck.supabaseKey}</div>
            <div>VITE_STRIPE_PUBLISHABLE_KEY: {envCheck.stripeKey}</div>
          </div>
        </div>

        <div style={{ background: "#1a1a1a", padding: "1.5rem", borderRadius: "8px", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Runtime Info:</h2>
          <div>SSR: {typeof window === "undefined" ? "âœ… Server-side" : "âŒ Client-side"}</div>
          <div>Node: {typeof process !== "undefined" ? "âœ… Available" : "âŒ Not available"}</div>
        </div>

        <div style={{ background: "#1a1a1a", padding: "1.5rem", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Status:</h2>
          <div style={{ color: "#10b981", fontSize: "1.5rem", fontWeight: "bold" }}>
            âœ… App is running!
          </div>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <a 
            href="/login" 
            style={{ 
              color: "#6366f1", 
              textDecoration: "none",
              fontSize: "1.1rem"
            }}
          >
            â†’ Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}


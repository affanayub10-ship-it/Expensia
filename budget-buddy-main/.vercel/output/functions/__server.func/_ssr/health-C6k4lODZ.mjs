import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/health-C6k4lODZ.js
var import_jsx_runtime = require_jsx_runtime();
function HealthCheck() {
	const envCheck = {
		supabaseUrl: "✅ Set",
		supabaseKey: "✅ Set",
		stripeKey: "✅ Set"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			background: "#0a0a0a",
			color: "#fff",
			fontFamily: "monospace",
			padding: "2rem"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: { maxWidth: "600px" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						fontSize: "2rem",
						marginBottom: "2rem"
					},
					children: "🏥 Health Check"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "#1a1a1a",
						padding: "1.5rem",
						borderRadius: "8px",
						marginBottom: "1rem"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: {
							fontSize: "1.2rem",
							marginBottom: "1rem"
						},
						children: "Environment Variables:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "0.5rem"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["VITE_SUPABASE_URL: ", envCheck.supabaseUrl] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["VITE_SUPABASE_ANON_KEY: ", envCheck.supabaseKey] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["VITE_STRIPE_PUBLISHABLE_KEY: ", envCheck.stripeKey] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "#1a1a1a",
						padding: "1.5rem",
						borderRadius: "8px",
						marginBottom: "1rem"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: "1.2rem",
								marginBottom: "1rem"
							},
							children: "Runtime Info:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["SSR: ", typeof window === "undefined" ? "✅ Server-side" : "❌ Client-side"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Node: ", typeof process !== "undefined" ? "✅ Available" : "❌ Not available"] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "#1a1a1a",
						padding: "1.5rem",
						borderRadius: "8px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: {
							fontSize: "1.2rem",
							marginBottom: "1rem"
						},
						children: "Status:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#10b981",
							fontSize: "1.5rem",
							fontWeight: "bold"
						},
						children: "✅ App is running!"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						marginTop: "2rem",
						textAlign: "center"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/login",
						style: {
							color: "#6366f1",
							textDecoration: "none",
							fontSize: "1.1rem"
						},
						children: "→ Go to Login"
					})
				})
			]
		})
	});
}
//#endregion
export { HealthCheck as component };

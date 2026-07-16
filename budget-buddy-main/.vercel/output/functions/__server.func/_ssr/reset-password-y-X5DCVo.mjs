import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { $ as EyeOff, Pt as ArrowLeft, Q as Eye, R as Lock, pt as CircleCheck, r as Wallet } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-y-X5DCVo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showNewPassword, setShowNewPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [isSuccess, setIsSuccess] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [isValidSession, setIsValidSession] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!session) {
				toast.error("Invalid or expired reset link. Please request a new password reset.");
				setTimeout(() => {
					navigate({ to: "/login" });
				}, 2e3);
			} else {
				setIsValidSession(true);
				if (typeof window !== "undefined") sessionStorage.setItem("password_reset_in_progress", "true");
			}
		});
		return () => {
			if (typeof window !== "undefined") sessionStorage.removeItem("password_reset_in_progress");
		};
	}, [navigate]);
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		if (newPassword.length < 6) {
			setError("Password must be at least 6 characters long");
			setIsLoading(false);
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}
		try {
			const { error } = await supabase.auth.updateUser({ password: newPassword });
			if (error) throw error;
			setIsSuccess(true);
			toast.success("Password updated successfully!");
			sessionStorage.removeItem("password_reset_in_progress");
			await supabase.auth.signOut();
			setTimeout(() => {
				navigate({ to: "/login" });
			}, 2e3);
		} catch (err) {
			setError(err.message || "Failed to update password");
			toast.error("Failed to update password");
		} finally {
			setIsLoading(false);
		}
	}
	if (!isValidSession) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			minHeight: "100dvh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			background: "hsl(240 10% 3.9%)",
			color: "#f8fafc",
			fontFamily: "'Inter', sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: { textAlign: "center" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				width: "48px",
				height: "48px",
				border: "3px solid rgba(99, 102, 241, 0.3)",
				borderTopColor: "#6366f1",
				borderRadius: "50%",
				animation: "spin 0.8s linear infinite",
				margin: "0 auto 16px"
			} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Verifying reset link..." })]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .reset-root {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          background: hsl(240 10% 3.9%);
          padding: 2rem 1.5rem;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reset-card {
          width: 100%;
          max-width: 26rem;
          opacity: 0;
          animation: slideUp 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .reset-card.mounted { opacity: 1; }

        .reset-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .reset-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #6366f1, #a855f7);
        }
        .reset-logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }

        .reset-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.03em;
          margin: 0 0 0.375rem;
          text-align: center;
        }

        .reset-subtitle {
          font-size: 0.9rem;
          color: hsl(240 5% 64.9%);
          margin: 0 0 2rem;
          text-align: center;
        }

        .reset-field {
          margin-bottom: 1.125rem;
        }

        .reset-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }

        .reset-input-wrap {
          position: relative;
        }

        .reset-input-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(240 5% 44.9%);
          pointer-events: none;
          width: 1rem;
          height: 1rem;
        }

        .reset-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 3rem 0.75rem 2.5rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(240 3.7% 20%);
          background: hsl(240 3.7% 10%);
          color: #f8fafc;
          font-size: 0.9375rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          -webkit-appearance: none;
        }

        .reset-input::placeholder {
          color: hsl(240 5% 44.9%);
        }

        .reset-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
        }

        .reset-eye-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: hsl(240 5% 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.375rem;
          padding: 0;
          transition: color 0.18s, background 0.18s;
          flex-shrink: 0;
        }

        .reset-eye-btn:hover {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.12);
        }

        .reset-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 1.125rem;
        }

        .reset-success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1.5rem;
          border-radius: 1rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          margin-bottom: 1.5rem;
        }

        .reset-success-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #34d399;
          margin: 0.75rem 0 0.375rem;
        }

        .reset-success-desc {
          font-size: 0.875rem;
          color: hsl(240 5% 74.9%);
          line-height: 1.5;
          margin: 0;
        }

        .reset-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 0.875rem;
          border: none;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }

        .reset-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99, 102, 241, 0.55);
        }

        .reset-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .reset-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .reset-spinner {
          width: 1.125rem;
          height: 1.125rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .reset-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: hsl(240 5% 64.9%);
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.18s;
          padding: 0;
          font-family: inherit;
          width: 100%;
          text-decoration: none;
        }

        .reset-back-btn:hover {
          color: #f8fafc;
        }

        .reset-hint {
          font-size: 0.75rem;
          color: hsl(240 5% 54.9%);
          margin-top: 0.375rem;
          line-height: 1.4;
        }

        /* Hide browser's password reveal */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none !important;
        }
      ` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "reset-root",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `reset-card ${mounted ? "mounted" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reset-logo",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "reset-logo-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, {
						size: 18,
						color: "#fff"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "reset-logo-text",
					children: "Expensia"
				})]
			}), isSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reset-success-box",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
						size: 40,
						className: "text-emerald-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "reset-success-title",
						children: "Password Updated!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "reset-success-desc",
						children: "Your password has been successfully updated. You'll be redirected to the login page shortly."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "reset-back-btn",
				onClick: () => {
					sessionStorage.removeItem("password_reset_in_progress");
					navigate({ to: "/login" });
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), "Back to sign in"]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "reset-title",
					children: "Reset your password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "reset-subtitle",
					children: "Enter your new password below"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reset-field",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "new-password",
									className: "reset-label",
									children: "New Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "reset-input-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "reset-input-icon" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "new-password",
											type: showNewPassword ? "text" : "password",
											autoComplete: "new-password",
											required: true,
											placeholder: "••••••••",
											value: newPassword,
											onChange: (e) => {
												setNewPassword(e.target.value);
												setError("");
											},
											className: "reset-input"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "reset-eye-btn",
											onClick: () => setShowNewPassword((v) => !v),
											"aria-label": showNewPassword ? "Hide password" : "Show password",
											children: showNewPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "reset-hint",
									children: "Must be at least 6 characters long"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reset-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "confirm-password",
								className: "reset-label",
								children: "Confirm New Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "reset-input-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "reset-input-icon" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "confirm-password",
										type: showConfirmPassword ? "text" : "password",
										autoComplete: "new-password",
										required: true,
										placeholder: "••••••••",
										value: confirmPassword,
										onChange: (e) => {
											setConfirmPassword(e.target.value);
											setError("");
										},
										className: "reset-input"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "reset-eye-btn",
										onClick: () => setShowConfirmPassword((v) => !v),
										"aria-label": showConfirmPassword ? "Hide password" : "Show password",
										children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
									})
								]
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reset-error",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚠" }), error]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "reset-btn",
							disabled: isLoading || !newPassword || !confirmPassword,
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "reset-spinner" }), "Updating password..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Update Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 16 })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "reset-back-btn",
							onClick: () => {
								sessionStorage.removeItem("password_reset_in_progress");
								navigate({ to: "/login" });
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), "Back to sign in"]
						})
					]
				})
			] })]
		})
	})] });
}
//#endregion
export { ResetPasswordPage as component };

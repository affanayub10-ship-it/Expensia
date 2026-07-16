import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { $ as EyeOff, F as Palette, Q as Eye, R as Lock, it as Crown, o as User, s as Upload, v as Sparkles, x as Shield, y as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { t as EXPENSE_CATEGORIES } from "./mock-data-Cl4Xf6-R.mjs";
import { r as PageHeader } from "./shared-Cu4KJl81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./AuthContext-B_dYwLk5.mjs";
import { f as useApp } from "./AppContext-BtlkEzV5.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { n as useSubscription } from "./SubscriptionContext-B9Jsp-Ce.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-wyLw4vIt.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BfwnAPHS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var TIMEZONES = [
	"America/Los_Angeles",
	"America/New_York",
	"Europe/London",
	"Europe/Berlin",
	"Asia/Kolkata",
	"Asia/Tokyo"
];
var DATE_FORMATS = [
	"MMM d, yyyy",
	"dd/MM/yyyy",
	"MM/dd/yyyy",
	"yyyy-MM-dd"
];
var LANGUAGES = [
	"English",
	"Spanish",
	"French",
	"German",
	"Hindi"
];
function SettingsPage() {
	const { settings, updateSettings, theme, toggleTheme } = useApp();
	const { changePassword } = useAuth();
	const { subscription, isPremium } = useSubscription();
	const [name, setName] = (0, import_react.useState)(settings.name);
	const [email, setEmail] = (0, import_react.useState)(settings.email);
	const [avatarPreview, setAvatarPreview] = (0, import_react.useState)(settings.avatar ?? null);
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [isChangingPassword, setIsChangingPassword] = (0, import_react.useState)(false);
	const [showCurrentPw, setShowCurrentPw] = (0, import_react.useState)(false);
	const [showNewPw, setShowNewPw] = (0, import_react.useState)(false);
	const [showConfirmPw, setShowConfirmPw] = (0, import_react.useState)(false);
	const initials = settings.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
	const handleAvatarChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Image must be under 2 MB");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const base64 = reader.result;
			setAvatarPreview(base64);
			toast.success("Picture selected — click Save profile to apply");
		};
		reader.readAsDataURL(file);
	};
	const handlePasswordChange = async () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error("Please fill in all password fields");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("New passwords don't match");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		if (newPassword === currentPassword) {
			toast.error("New password must be different from current password");
			return;
		}
		setIsChangingPassword(true);
		try {
			const result = await changePassword(currentPassword, newPassword);
			if (result.success) {
				toast.success("Password updated successfully!");
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			} else toast.error(result.error || "Failed to update password");
		} catch (error) {
			toast.error(error.message || "An error occurred");
		} finally {
			setIsChangingPassword(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-strong-password-auto-fill-button {
          display: none !important;
          visibility: hidden !important;
        }
      ` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			description: "Manage your profile, preferences, and app configuration."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-primary" }), " Profile"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "h-16 w-16",
									children: avatarPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: avatarPreview,
										alt: "Profile",
										className: "h-full w-full rounded-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "bg-primary/10 text-lg font-medium text-primary",
										children: initials
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Upload picture"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/png,image/jpeg,image/webp",
												className: "hidden",
												onChange: handleAvatarChange
											})]
										}),
										avatarPreview && avatarPreview !== settings.avatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-xs text-muted-foreground hover:text-foreground underline text-left",
											onClick: () => setAvatarPreview(settings.avatar ?? null),
											children: "Remove"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "JPEG, PNG, WebP · max 2 MB"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									updateSettings({
										name,
										email,
										avatar: avatarPreview ?? void 0
									});
									toast.success("Profile saved");
								},
								children: "Save profile"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-primary" }), " Change password"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Current password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: showCurrentPw ? "text" : "password",
										placeholder: "••••••••",
										value: currentPassword,
										onChange: (e) => setCurrentPassword(e.target.value),
										className: "pr-10"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowCurrentPw((v) => !v),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
										"aria-label": showCurrentPw ? "Hide password" : "Show password",
										children: showCurrentPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "New password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: showNewPw ? "text" : "password",
										placeholder: "••••••••",
										value: newPassword,
										onChange: (e) => setNewPassword(e.target.value),
										className: "pr-10"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowNewPw((v) => !v),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
										"aria-label": showNewPw ? "Hide password" : "Show password",
										children: showNewPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Confirm new password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: showConfirmPw ? "text" : "password",
										placeholder: "••••••••",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										className: "pr-10"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowConfirmPw((v) => !v),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
										"aria-label": showConfirmPw ? "Hide password" : "Show password",
										children: showConfirmPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: handlePasswordChange,
								disabled: isChangingPassword,
								children: isChangingPassword ? "Updating..." : "Update password"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4 text-primary" }), " Appearance"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Dark mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Toggle light and dark theme"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: theme === "dark",
									onCheckedChange: toggleTheme
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingSelect, {
								label: "Language",
								value: settings.language,
								options: LANGUAGES,
								onChange: (v) => updateSettings({ language: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingSelect, {
								label: "Date format",
								value: settings.dateFormat,
								options: DATE_FORMATS,
								onChange: (v) => updateSettings({ dateFormat: v })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-primary" }), " Preferences"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingSelect, {
							label: "Timezone",
							value: settings.timezone,
							options: TIMEZONES,
							onChange: (v) => updateSettings({ timezone: v })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingSelect, {
							label: "Default expense category",
							value: settings.defaultCategory,
							options: EXPENSE_CATEGORIES.map((c) => c.name),
							onChange: (v) => updateSettings({ defaultCategory: v })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [isPremium ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" }), "Subscription"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-semibold capitalize",
											children: [subscription.plan, " Plan"]
										}),
										isPremium && subscription.cancelAtPeriodEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500",
											children: "Cancelling"
										}),
										isPremium && !subscription.cancelAtPeriodEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-income/15 px-2 py-0.5 text-[10px] font-semibold text-income",
											children: "Active"
										}),
										!isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
											children: subscription.status === "canceled" ? "Canceled" : "Free"
										})
									]
								}),
								isPremium && subscription.currentPeriodEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), subscription.cancelAtPeriodEnd ? `Active until ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`]
								}),
								!isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Upgrade to unlock Budgets, Savings & more"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/premium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: isPremium ? "outline" : "default",
								size: "sm",
								className: "gap-1.5 shrink-0",
								children: isPremium ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5" }), " View Premium"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " View Premium"] })
							})
						})]
					})]
				})
			]
		})
	] });
}
function SettingSelect({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value,
			onValueChange: onChange,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: o,
				children: o
			}, o)) })]
		})]
	});
}
//#endregion
export { SettingsPage as component };

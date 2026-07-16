import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { At as Bell, C as Settings, Ct as ChartColumn, I as Moon, M as PiggyBank, R as Lock, V as LayoutDashboard, bt as ChevronDown, ct as Circle, gt as CircleArrowDown, h as Sun, ht as CircleArrowUp, it as Crown, kt as Brain, n as X, r as Wallet, ut as CircleQuestionMark, xt as Check, yt as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as useAuth, t as AuthProvider } from "./AuthContext-B_dYwLk5.mjs";
import { f as useApp, t as AppProvider } from "./AppContext-BtlkEzV5.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BA-nrckz.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as useSubscription, t as SubscriptionProvider } from "./SubscriptionContext-B9Jsp-Ce.mjs";
import { _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PremiumUpgradeModal } from "./PremiumUpgradeModal-BSGaT9U0.mjs";
import { n as AvatarFallback, r as AvatarImage, t as Avatar } from "./avatar-wyLw4vIt.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cv7NSdmO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BzYrQMD_.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
var NAV = [
	{
		label: "Dashboard",
		to: "/",
		icon: LayoutDashboard
	},
	{
		label: "Income",
		to: "/income",
		icon: CircleArrowUp
	},
	{
		label: "Expenses",
		to: "/expenses",
		icon: CircleArrowDown
	},
	{
		label: "Budgets",
		to: "/budgets",
		icon: Wallet
	},
	{
		label: "Reports",
		to: "/reports",
		icon: ChartColumn
	},
	{
		label: "Savings",
		to: "/savings",
		icon: PiggyBank
	},
	{
		label: "Predictions",
		to: "/predictions",
		icon: Brain
	},
	{
		label: "Premium",
		to: "/premium",
		icon: Crown
	},
	{
		label: "Settings",
		to: "/settings",
		icon: Settings
	}
];
function NotificationBell() {
	const { notifications, markNotificationsRead } = useApp();
	const unread = notifications.filter((n) => !n.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
		onOpenChange: (o) => o && markNotificationsRead(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "icon",
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-expense px-1 text-[10px] font-semibold text-expense-foreground",
					children: unread
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			className: "w-80",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Notifications" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "max-h-80",
					children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-0.5 px-2 py-2.5 hover:bg-muted/50 rounded-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: n.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-[11px] text-muted-foreground",
								children: n.time
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: n.message
						})]
					}, n.id))
				})
			]
		})]
	});
}
var PREMIUM_ROUTES = /* @__PURE__ */ new Set([
	"/budgets",
	"/savings",
	"/predictions"
]);
function AppLayout({ children }) {
	const { theme, toggleTheme, settings } = useApp();
	const { isAuthenticated, isLoading, logout, onboardingComplete } = useAuth();
	const { isPremium } = useSubscription();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (to) => to === "/" ? pathname === "/" : pathname.startsWith(to);
	const [lightboxOpen, setLightboxOpen] = (0, import_react.useState)(false);
	const [helpOpen, setHelpOpen] = (0, import_react.useState)(false);
	const [upgradeOpen, setUpgradeOpen] = (0, import_react.useState)(false);
	const isLoginPage = pathname === "/login";
	const isOnboardingPage = pathname === "/onboarding";
	const isResetPasswordPage = pathname === "/reset-password";
	const isPasswordResetInProgress = typeof window !== "undefined" && sessionStorage.getItem("password_reset_in_progress") === "true";
	const initials = settings.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
	const avatar = settings.avatar;
	if (isLoading) return null;
	if (!isAuthenticated && !isLoginPage && !isOnboardingPage && !isResetPasswordPage) {
		setTimeout(() => navigate({ to: "/login" }), 0);
		return null;
	}
	if (isAuthenticated && !onboardingComplete && !isLoginPage && !isOnboardingPage && !isResetPasswordPage) {
		setTimeout(() => navigate({ to: "/onboarding" }), 0);
		return null;
	}
	if (isPasswordResetInProgress && !isResetPasswordPage) {
		setTimeout(() => navigate({ to: "/reset-password" }), 0);
		return null;
	}
	if (isLoginPage || isOnboardingPage || isResetPasswordPage) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	function handleSignOut() {
		logout();
		navigate({ to: "/login" });
	}
	function UserAvatar({ size = "md", noZoom }) {
		const cls = size === "sm" ? "h-8 w-8" : "h-9 w-9";
		const textCls = size === "sm" ? "text-xs" : "text-sm";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
			className: cn(cls, !noZoom && avatar ? "cursor-zoom-in" : ""),
			onClick: !noZoom && avatar ? () => setLightboxOpen(true) : void 0,
			children: [avatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
				src: avatar,
				alt: settings.name,
				className: "object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
				className: cn("bg-primary/10 text-primary font-medium", textCls),
				children: initials
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen w-full bg-background",
		children: [
			lightboxOpen && avatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm",
				onClick: () => setLightboxOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: avatar,
							alt: settings.name,
							className: "max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setLightboxOpen(false),
							className: "absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-center text-sm font-medium text-white/80",
							children: settings.name
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center gap-2 px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-semibold tracking-tight text-sidebar-foreground",
							children: "Expensia"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-1 px-3 py-4",
						children: NAV.map((item) => {
							const locked = PREMIUM_ROUTES.has(item.to) && !isPremium;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: locked ? "#" : item.to,
								onClick: (e) => {
									if (locked) {
										e.preventDefault();
										setUpgradeOpen(true);
									}
								},
								className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", locked && "opacity-60", isActive(item.to) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-5 w-5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1",
										children: item.label
									}),
									locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-muted-foreground" })
								]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-sidebar-border p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, { size: "md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/settings",
								className: "min-w-0 flex-1 hover:opacity-80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-sidebar-foreground",
									children: settings.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-sidebar-foreground/60",
									children: settings.email
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center justify-end gap-1 sm:gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setHelpOpen(true),
								"aria-label": "Help",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: toggleTheme,
								"aria-label": "Toggle theme",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBell, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									className: "gap-1.5 rounded-full px-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
										size: "sm",
										noZoom: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-52",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: settings.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/settings",
											children: "Profile & Settings"
										})
									}),
									avatar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => setLightboxOpen(true),
										children: "View Picture"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										className: "text-destructive focus:text-destructive",
										onClick: handleSignOut,
										children: "Sign out"
									})
								]
							})] })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: helpOpen,
				onOpenChange: setHelpOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[85vh] overflow-y-auto sm:max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "How to use Expensia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "A quick guide to every section of the app." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Dashboard",
								children: "Your financial overview. See your current balance, total income, expenses, and remaining budget at a glance. The monthly chart shows income vs spending over the last 6 months. The pie chart breaks down spending by category."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
								title: "Expenses",
								children: [
									"Every expense you add appears here, 20 per page. Use the search bar to find by title or category. Filter by date range, category, or sort by date/amount. The summary card shows totals for the current filter. Click ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Add expense" }),
									" to log a new one — set amount with the slider, pick a category, and add optional notes or a receipt."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Income",
								children: "Track money coming in. Search by source or category, filter by category, and sort by date/amount/source. Inline quick-add for $50/$100/$200/$500/$1000, or open the drawer for a full form with slider. Set recurring income (daily/weekly/monthly/yearly) and the app auto-advances the next date."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
								title: "Budgets",
								children: [
									"Set monthly spending limits per category. The card shows progress with color coding (green = safe, yellow = near limit, red = exceeded). ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Hover" }),
									" any budget card to see a breakdown of transactions in that category. Alerts appear at the top when you're close to or over a limit."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
								title: "Savings",
								children: [
									"Create savings goals with a target amount. Each goal shows your progress bar. Use ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Add $100" }),
									" / ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Withdraw $100" }),
									" for quick changes, or click ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Custom" }),
									" to open a slider for any amount. Edit or delete goals with the pencil / trash buttons."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Reports",
								children: "Visual breakdown of your spending — category distribution, spending trends over time, and monthly comparisons. Useful for spotting where your money goes."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Predictions",
								children: "AI-powered spending predictions based on your history. Shows forecasted amounts for the next period and highlights categories that may need attention."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Settings",
								children: "Customize your experience — toggle dark/light theme, change your name or avatar, set your preferred date format and currency, and manage notification preferences."
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-md lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-lg items-center justify-around px-2 py-1.5",
					children: NAV.map((item) => {
						const locked = PREMIUM_ROUTES.has(item.to) && !isPremium;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: locked ? "#" : item.to,
							onClick: (e) => {
								if (locked) {
									e.preventDefault();
									setUpgradeOpen(true);
								}
							},
							className: cn("relative flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors", isActive(item.to) ? "text-primary" : "text-muted-foreground", locked && "opacity-60"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-5 w-5" }),
								item.label,
								locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute -right-2 -top-0.5 h-3 w-3 text-muted-foreground" })
							]
						}, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumUpgradeModal, {
				open: upgradeOpen,
				onClose: () => setUpgradeOpen(false)
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		className: "mb-1 font-semibold text-foreground",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground leading-relaxed",
		children
	})] });
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Expensia — Smart Expense Tracker" },
			{
				name: "description",
				content: "Track income and expenses, manage budgets, and visualize spending with a clean, modern personal finance dashboard."
			},
			{
				name: "author",
				content: "Expensia"
			},
			{
				property: "og:title",
				content: "Expensia — Smart Expense Tracker"
			},
			{
				property: "og:description",
				content: "Track income and expenses, manage budgets, and visualize spending with a clean, modern personal finance dashboard."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#4f46e5"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/icon.svg"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "manifest",
				href: "/manifest.json"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon.svg"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && "serviceWorker" in navigator) window.addEventListener("load", () => {
			navigator.serviceWorker.register("/sw.js").catch((err) => {
				console.error("SW registration failed: ", err);
			});
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})] }) }) })
	});
}
var $$splitComponentImporter$14 = () => import("./settings-BfwnAPHS.mjs");
var Route$14 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./savings-D3UEkJbI.mjs");
var Route$13 = createFileRoute("/savings")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./reset-password-y-X5DCVo.mjs");
var Route$12 = createFileRoute("/reset-password")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./reports-DLAkkr6U.mjs");
var Route$11 = createFileRoute("/reports")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./pricing-BxgpPqWP.mjs");
var Route$10 = createFileRoute("/pricing")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./premium-CdsJvvpC.mjs");
var Route$9 = createFileRoute("/premium")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./predictions-B_QEEfKy.mjs");
var Route$8 = createFileRoute("/predictions")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./onboarding-CIAMNU_J.mjs");
var Route$7 = createFileRoute("/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./login-CiczNmrP.mjs");
var Route$6 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./income-D_YNJ-dO.mjs");
var Route$5 = createFileRoute("/income")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./health-C6k4lODZ.mjs");
var Route$4 = createFileRoute("/health")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./expenses-DVr9NWEG.mjs");
var Route$3 = createFileRoute("/expenses")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./budgets-Cm-QCklO.mjs");
var Route$2 = createFileRoute("/budgets")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin-subscriptions-BJKdg-zw.mjs");
var Route$1 = createFileRoute("/admin-subscriptions")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./routes-CVDB2hL9.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SettingsRoute = Route$14.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$15
});
var SavingsRoute = Route$13.update({
	id: "/savings",
	path: "/savings",
	getParentRoute: () => Route$15
});
var ResetPasswordRoute = Route$12.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$15
});
var ReportsRoute = Route$11.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$15
});
var PricingRoute = Route$10.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$15
});
var PremiumRoute = Route$9.update({
	id: "/premium",
	path: "/premium",
	getParentRoute: () => Route$15
});
var PredictionsRoute = Route$8.update({
	id: "/predictions",
	path: "/predictions",
	getParentRoute: () => Route$15
});
var OnboardingRoute = Route$7.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$15
});
var LoginRoute = Route$6.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$15
});
var IncomeRoute = Route$5.update({
	id: "/income",
	path: "/income",
	getParentRoute: () => Route$15
});
var HealthRoute = Route$4.update({
	id: "/health",
	path: "/health",
	getParentRoute: () => Route$15
});
var ExpensesRoute = Route$3.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => Route$15
});
var BudgetsRoute = Route$2.update({
	id: "/budgets",
	path: "/budgets",
	getParentRoute: () => Route$15
});
var AdminSubscriptionsRoute = Route$1.update({
	id: "/admin-subscriptions",
	path: "/admin-subscriptions",
	getParentRoute: () => Route$15
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$15
	}),
	AdminSubscriptionsRoute,
	BudgetsRoute,
	ExpensesRoute,
	HealthRoute,
	IncomeRoute,
	LoginRoute,
	OnboardingRoute,
	PredictionsRoute,
	PremiumRoute,
	PricingRoute,
	ReportsRoute,
	ResetPasswordRoute,
	SavingsRoute,
	SettingsRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

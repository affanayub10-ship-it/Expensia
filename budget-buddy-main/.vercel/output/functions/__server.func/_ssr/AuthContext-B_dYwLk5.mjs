import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthContext-B_dYwLk5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Hybrid Authentication System
* 
* This supports both:
* 1. Database-stored credentials (for demo/testing)
* 2. Real Supabase authentication (for production)
*/
/**
* Check if email exists in credentials table
*/
async function checkCredentials(email, password) {
	const { data, error } = await supabase.from("user_credentials").select("*").eq("email", email.toLowerCase().trim()).eq("password", password).single();
	if (error || !data) return { valid: false };
	return {
		valid: true,
		user: {
			email: data.email,
			password: data.password,
			name: data.name,
			is_demo: data.is_demo
		}
	};
}
/**
* Login with database credentials (creates Supabase auth user if needed)
*/
async function loginWithStoredCredentials(email, password) {
	const normalizedEmail = email.toLowerCase().trim();
	const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
		email: normalizedEmail,
		password
	});
	if (!signInError) return {
		success: true,
		isNewUser: false
	};
	const credCheck = await checkCredentials(normalizedEmail, password);
	if (credCheck.valid && credCheck.user) {
		const { error: signUpError } = await supabase.auth.signUp({
			email: normalizedEmail,
			password,
			options: {
				data: { name: credCheck.user.name },
				emailRedirectTo: void 0
			}
		});
		if (signUpError && !signUpError.message.includes("already registered")) return {
			success: false,
			error: signUpError.message
		};
		const { error: retryError } = await supabase.auth.signInWithPassword({
			email: normalizedEmail,
			password
		});
		if (retryError) return {
			success: false,
			error: retryError.message
		};
		return {
			success: true,
			isNewUser: true
		};
	}
	return {
		success: false,
		error: "Invalid email or password"
	};
}
/**
* Register new user (adds to both credentials table and Supabase Auth)
*/
async function registerWithStoredCredentials(name, email, password) {
	const normalizedEmail = email.toLowerCase().trim();
	const { data: existingAuth } = await supabase.auth.signInWithPassword({
		email: normalizedEmail,
		password: "test"
	});
	const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
		email: normalizedEmail,
		password,
		options: {
			data: { name },
			emailRedirectTo: void 0
		}
	});
	if (signUpError) {
		if (signUpError.message.includes("already registered")) return {
			success: false,
			error: "Email already registered. Try logging in instead."
		};
		return {
			success: false,
			error: signUpError.message
		};
	}
	try {
		await supabase.from("user_credentials").insert({
			email: normalizedEmail,
			password,
			name,
			is_demo: false
		});
		await supabase.from("profiles").update({ password }).eq("email", normalizedEmail);
	} catch (insertError) {
		console.error("Error storing credentials (non-critical):", insertError);
	}
	const { error: loginError } = await supabase.auth.signInWithPassword({
		email: normalizedEmail,
		password
	});
	if (loginError) return {
		success: true,
		error: "Account created! Please login manually."
	};
	return { success: true };
}
/**
* Change user password (updates both Supabase Auth and credentials table)
*/
async function changePassword(currentPassword, newPassword) {
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return {
		success: false,
		error: "Not authenticated"
	};
	const { error: verifyError } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: currentPassword
	});
	if (verifyError) return {
		success: false,
		error: "Current password is incorrect"
	};
	const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
	if (updateError) return {
		success: false,
		error: updateError.message
	};
	const { error: dbError } = await supabase.from("user_credentials").update({ password: newPassword }).eq("email", user.email.toLowerCase().trim());
	if (dbError) console.error("Error updating password in credentials table:", dbError);
	const { error: profileError } = await supabase.from("profiles").update({ password: newPassword }).eq("email", user.email.toLowerCase().trim());
	if (profileError) console.error("Error updating password in profiles table:", profileError);
	return { success: true };
}
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isNewUser, setIsNewUser] = (0, import_react.useState)(false);
	const [onboardingComplete, setOnboardingComplete] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session?.user) loadUserProfile(session.user.id);
			else setIsLoading(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.user) loadUserProfile(session.user.id);
			else {
				setUser(null);
				setIsLoading(false);
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	async function loadUserProfile(userId) {
		try {
			let profile = null;
			for (let attempt = 0; attempt < 3; attempt++) {
				const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
				if (data) {
					profile = data;
					break;
				}
				if (attempt < 2) await new Promise((r) => setTimeout(r, 600));
			}
			if (profile) {
				setUser({
					email: profile.email,
					name: profile.name,
					avatar: profile.avatar || void 0,
					onboardingComplete: profile.onboarding_complete || false
				});
				setOnboardingComplete(profile.onboarding_complete || false);
			} else setOnboardingComplete(false);
		} catch (error) {
			console.error("Error loading profile:", error);
			setOnboardingComplete(false);
		} finally {
			setIsLoading(false);
		}
	}
	async function login(email, password) {
		try {
			return await loginWithStoredCredentials(email, password);
		} catch (error) {
			return {
				success: false,
				error: error.message || "Login failed"
			};
		}
	}
	async function signup(name, email, password) {
		try {
			const result = await registerWithStoredCredentials(name, email, password);
			if (result.success) {
				setIsNewUser(true);
				localStorage.removeItem("onboarding_complete");
			}
			return result;
		} catch (error) {
			return {
				success: false,
				error: error.message || "Signup failed"
			};
		}
	}
	async function resetPassword(email) {
		try {
			const origin = typeof window !== "undefined" ? window.location.origin : "";
			const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), { redirectTo: `${origin}/reset-password` });
			if (error) return {
				success: false,
				error: error.message
			};
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || "Password reset failed"
			};
		}
	}
	async function updateUser(name, email) {
		try {
			const { data: { user: authUser } } = await supabase.auth.getUser();
			if (!authUser) return {
				success: false,
				error: "Not authenticated"
			};
			const { error } = await supabase.from("profiles").update({
				name,
				email: email.toLowerCase().trim()
			}).eq("id", authUser.id);
			if (error) return {
				success: false,
				error: error.message
			};
			setUser({
				email: email.toLowerCase().trim(),
				name,
				avatar: user?.avatar
			});
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || "Update failed"
			};
		}
	}
	async function changePassword$1(currentPassword, newPassword) {
		try {
			return await changePassword(currentPassword, newPassword);
		} catch (error) {
			return {
				success: false,
				error: error.message || "Password change failed"
			};
		}
	}
	async function completeOnboarding() {
		try {
			const { data: { user: authUser } } = await supabase.auth.getUser();
			if (!authUser) return {
				success: false,
				error: "Not authenticated"
			};
			const { error } = await supabase.from("profiles").update({ onboarding_complete: true }).eq("id", authUser.id);
			if (error) {
				if (error.code === "42703") {
					console.warn("onboarding_complete column missing. Run supabase-add-onboarding-column.sql");
					setOnboardingComplete(true);
					setUser((u) => u ? {
						...u,
						onboardingComplete: true
					} : u);
					return { success: true };
				}
				return {
					success: false,
					error: error.message
				};
			}
			setOnboardingComplete(true);
			setUser((u) => u ? {
				...u,
				onboardingComplete: true
			} : u);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || "Failed to complete onboarding"
			};
		}
	}
	async function logout() {
		await supabase.auth.signOut();
		setUser(null);
		setOnboardingComplete(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			isAuthenticated: !!user,
			isLoading,
			isNewUser,
			onboardingComplete,
			completeOnboarding,
			login,
			signup,
			resetPassword,
			updateUser,
			changePassword: changePassword$1,
			logout
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };

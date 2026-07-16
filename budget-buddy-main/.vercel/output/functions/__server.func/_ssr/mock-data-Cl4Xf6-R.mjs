import { Dt as Building2, H as Laptop, J as Fuel, K as GraduationCap, O as ReceiptText, Ot as Briefcase, T as RotateCcw, U as House, W as HeartPulse, b as ShoppingBag, i as Utensils, j as Plane, q as Gift, st as Clapperboard, tt as Ellipsis, u as TrendingUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-data-Cl4Xf6-R.js
var EXPENSE_CATEGORIES = [
	{
		id: "food",
		name: "Food",
		icon: Utensils,
		color: "chart-4"
	},
	{
		id: "fuel",
		name: "Fuel",
		icon: Fuel,
		color: "chart-3"
	},
	{
		id: "rent",
		name: "Rent",
		icon: House,
		color: "chart-6"
	},
	{
		id: "shopping",
		name: "Shopping",
		icon: ShoppingBag,
		color: "chart-5"
	},
	{
		id: "entertainment",
		name: "Entertainment",
		icon: Clapperboard,
		color: "chart-1"
	},
	{
		id: "healthcare",
		name: "Healthcare",
		icon: HeartPulse,
		color: "chart-2"
	},
	{
		id: "education",
		name: "Education",
		icon: GraduationCap,
		color: "chart-6"
	},
	{
		id: "bills",
		name: "Bills",
		icon: ReceiptText,
		color: "chart-3"
	},
	{
		id: "travel",
		name: "Travel",
		icon: Plane,
		color: "chart-1"
	},
	{
		id: "furniture",
		name: "Furniture",
		icon: House,
		color: "chart-4"
	},
	{
		id: "other",
		name: "Other",
		icon: Ellipsis,
		color: "chart-5"
	}
];
var INCOME_CATEGORIES = [
	{
		id: "salary",
		name: "Salary",
		icon: Briefcase,
		color: "chart-2"
	},
	{
		id: "freelance",
		name: "Freelance",
		icon: Laptop,
		color: "chart-1"
	},
	{
		id: "investment",
		name: "Investment",
		icon: TrendingUp,
		color: "chart-6"
	},
	{
		id: "business",
		name: "Business",
		icon: Building2,
		color: "chart-3"
	},
	{
		id: "refund",
		name: "Refund",
		icon: RotateCcw,
		color: "chart-5"
	},
	{
		id: "bonus",
		name: "Bonus",
		icon: Gift,
		color: "chart-4"
	},
	{
		id: "other",
		name: "Other",
		icon: Ellipsis,
		color: "chart-5"
	}
];
function categoryByName(name, list) {
	return list.find((c) => c.name === name) ?? list[list.length - 1];
}
var today = /* @__PURE__ */ new Date();
function daysAgo(n) {
	const d = new Date(today);
	d.setDate(d.getDate() - n);
	return d.toISOString().slice(0, 10);
}
daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5), daysAgo(6), daysAgo(8), daysAgo(10), daysAgo(12), daysAgo(13), daysAgo(15), daysAgo(18), daysAgo(20), daysAgo(22);
daysAgo(2), daysAgo(6), daysAgo(9), daysAgo(12), daysAgo(20);
//#endregion
export { INCOME_CATEGORIES as n, categoryByName as r, EXPENSE_CATEGORIES as t };

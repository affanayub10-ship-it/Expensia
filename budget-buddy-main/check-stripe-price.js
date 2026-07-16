// Quick script to check Stripe price configuration
// Run with: node check-stripe-price.js

const STRIPE_SECRET_KEY = "sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj";

const MONTHLY_PRICE_ID = "price_1TshgvRp1jrpNofsa0P5jLAG";
const YEARLY_PRICE_ID = "price_1TtkaWRp1jrpNofsKy0A1De1";

async function checkPrice(priceId, label) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Checking ${label}: ${priceId}`);
  console.log("=".repeat(60));
  
  try {
    const response = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
      }
    });
    
    const price = await response.json();
    
    if (price.error) {
      console.error("❌ Error:", price.error.message);
      return;
    }
    
    console.log("\n✅ Price Details:");
    console.log("  Amount:", `$${(price.unit_amount / 100).toFixed(2)}`);
    console.log("  Currency:", price.currency.toUpperCase());
    console.log("  Active:", price.active ? "Yes ✅" : "No ❌");
    console.log("  Type:", price.type);
    
    if (price.recurring) {
      console.log("\n📅 Billing Configuration:");
      console.log("  Interval:", price.recurring.interval.toUpperCase());
      console.log("  Interval Count:", price.recurring.interval_count);
      console.log("  Usage Type:", price.recurring.usage_type);
      
      // Check if this matches expected configuration
      if (label.includes("Monthly")) {
        if (price.recurring.interval === "month" && price.recurring.interval_count === 1) {
          console.log("\n✅ CORRECT: Monthly price is configured properly");
        } else {
          console.log("\n❌ WRONG: Monthly price should be 'month' with interval_count 1");
        }
      }
      
      if (label.includes("Yearly")) {
        if (price.recurring.interval === "year" && price.recurring.interval_count === 1) {
          console.log("\n✅ CORRECT: Yearly price is configured properly");
        } else {
          console.log("\n❌ WRONG: Yearly price should be 'year' with interval_count 1");
          console.log("   Current:", price.recurring.interval, "x", price.recurring.interval_count);
          console.log("\n🔧 ACTION NEEDED: Create a new price with billing period 'Year'");
        }
      }
    }
    
    // Check currency
    if (price.currency !== "usd") {
      console.log("\n⚠️  WARNING: Currency is", price.currency.toUpperCase(), "instead of USD");
    }
    
    // Check if multi-currency
    if (price.currency_options && Object.keys(price.currency_options).length > 0) {
      console.log("\n⚠️  Multi-currency enabled with currencies:", Object.keys(price.currency_options).join(", "));
      console.log("   This may cause PKR to show in checkout");
    }
    
  } catch (error) {
    console.error("❌ Failed to fetch price:", error.message);
  }
}

async function main() {
  console.log("\n🔍 STRIPE PRICE CONFIGURATION CHECK");
  console.log("Testing prices from .env file\n");
  
  await checkPrice(MONTHLY_PRICE_ID, "Monthly Price");
  await checkPrice(YEARLY_PRICE_ID, "Yearly Price");
  
  console.log("\n" + "=".repeat(60));
  console.log("Check complete!");
  console.log("=".repeat(60) + "\n");
}

main();

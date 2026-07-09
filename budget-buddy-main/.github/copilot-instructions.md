# Project: Budget Buddy — Expense Management System

## What this project is

A full-stack personal finance web app that lets users track income and expenses,
manage category-based budgets, and view spending analytics through charts and reports.

## Tech stack

- Frontend: Built in Lovable, using TanStack Start (React, TypeScript, SSR), Tailwind CSS
- Backend (to be built): Express + TypeScript
- ORM: Prisma
- Database: PostgreSQL (via Supabase)
- Auth: Email/password with sessions or JWT
- File uploads: Receipt images/PDFs (JPEG, PNG, PDF, max 10MB)

## Core entities (match these exactly in Prisma schema)

### User

id, name, email, password (hashed), currency, timezone, profilePicture, createdAt, updatedAt

### Expense

id, userId (FK), title, description, amount (positive only), date, category (FK),
merchant, location, paymentMethod, currency, status (Paid | Pending | Cancelled),
receiptUrl, notes, tags (string array), isRecurring (boolean), recurringFrequency
(Daily | Weekly | Monthly | Quarterly | Yearly), createdAt, updatedAt, deletedAt (soft delete)

### Income

id, userId (FK), amount, date, source, category (Salary | Freelance | Investment |
Business | Refund | Bonus | Other), notes, attachmentUrl, createdAt, updatedAt

### Category

id, userId (FK, nullable for defaults), name, type (Income | Expense), color, icon

### Budget

id, userId (FK), categoryId (FK), monthlyLimit, currentSpending (calculated), createdAt, updatedAt

### PaymentMethod

id, userId (FK, nullable for defaults), name, type (Cash | Debit Card | Credit Card |
Bank Transfer | Mobile Wallet | Custom)

## Business rules (enforce these in backend logic, not just frontend)

- Users can only access their own records — always filter queries by the authenticated userId.
- Expense and income amounts must be greater than 0; reject negative or zero values.
- Deleting an expense is a soft delete (set deletedAt, don't remove from DB).
- A category cannot be deleted if transactions still reference it — return an error asking
  the user to reassign transactions first.
- Budget currentSpending is recalculated automatically whenever a related expense is
  added, edited, or deleted.
- Recurring expenses (frequency-based) should generate new expense entries automatically
  based on their schedule.
- File uploads must be validated for type (jpeg/png/pdf only) and size (max 10MB) before storing.

## API conventions

- All routes prefixed with `/api/v1`
- REST-style endpoints, e.g.:
  - GET /api/v1/expenses (supports query params: category, dateFrom, dateTo, amountMin,
    amountMax, paymentMethod, tags, sortBy, order)
  - POST /api/v1/expenses
  - PUT /api/v1/expenses/:id
  - DELETE /api/v1/expenses/:id (soft delete)
- Every response follows this shape:

```json
{ "success": true, "data": {}, "error": null }
```

or on failure:

```json
{ "success": false, "data": null, "error": "message" }
```

- Use middleware for authentication — reject requests without a valid session/token.
- Use TypeScript interfaces/types for all request bodies and responses — no implicit `any`.

## Reports & analytics endpoints needed

- GET /api/v1/reports/monthly — total income, total expense, savings, budget used
- GET /api/v1/reports/category — amount + percentage per category
- GET /api/v1/reports/payment-method — breakdown by payment method
- GET /api/v1/reports/highlights — highest expense, most frequent merchant, average daily spending
- GET /api/v1/reports/export?format=csv|excel|pdf

## Folder structure to follow

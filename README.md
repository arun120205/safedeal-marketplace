🤝 SafeDeal — AI-Powered Escrow Marketplace
Buy & Sell with Confidence — a full-stack second-hand marketplace where payments are held in escrow until delivery is confirmed, protected by AI agents.

🏗️ Tech Stack
Backend: Java 21, Spring Boot, Spring Security (JWT), MySQL, Razorpay, Cloudinary
Frontend: React (Vite), Tailwind CSS, Razorpay Checkout
AI: Google Gemini API — Listing Guardian + Dispute Resolver agents
✨ Key Features
🔒 Escrow Payments — buyer's money locked until delivery confirmed, released via HMAC-SHA256 verified transactions
🤖 AI Listing Guardian — Gemini Vision auto-approves/rejects listings (fraud detection)
🤖 AI Dispute Resolver — agent investigates disputes across 5 data sources and recommends verdicts
⏰ 72h Auto-Release — scheduled job protects sellers from unresponsive buyers
💰 Wallet Ledger — every rupee movement recorded (payment, lock, release, commission, refund)
⚖️ Admin Dispute Panel — evidence-based resolution with full AI audit logs
🚀 Run Locally
Backend
cd backend

configure src/main/resources/application-local.properties (DB, Razorpay, Cloudinary, Gemini keys)
./mvnw spring-boot:run

Frontend
cd frontendnpm installnpm run dev

📊 Order Flow
Post → Buy (Razorpay) → Money LOCKED 🔒 → Ship → Deliver → Buyer Confirms → Money RELEASED 💰

Commit + push it:
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

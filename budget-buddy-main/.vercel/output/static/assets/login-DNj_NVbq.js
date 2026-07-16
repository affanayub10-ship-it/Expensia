import{i as e,t}from"./jsx-runtime-DUAcabCT.js";import{n,s as r}from"./createLucideIcon-2NVixTfB.js";import{t as i}from"./arrow-left-BQSYrU9G.js";import{t as a}from"./circle-check-BNe4cZB7.js";import{n as o,t as s}from"./eye-QsoMlfMv.js";import{t as c}from"./mail-CpOXRuMv.js";import{t as l}from"./shield-check-BOShfaoT.js";import{t as u}from"./trending-up-DqAXZ5hU.js";import{t as d}from"./user-Rgt7s5-F.js";import{A as f,B as p,M as m,W as h,k as g,tt as _}from"./index-B4kx1lb7.js";var v=e(r()),y=t(),b=[{icon:u,text:`Real-time expense tracking`},{icon:l,text:`Secure & private by default`},{icon:f,text:`Smart budgeting insights`}],x=[{label:`Demo`,email:`demo@budgetbuddy.com`,password:`Demo@1234`}];function S(){let{login:e,signup:t,resetPassword:r,isAuthenticated:l,onboardingComplete:u}=h(),f=_(),[S,C]=(0,v.useState)(`login`),[w,T]=(0,v.useState)(``),[E,D]=(0,v.useState)(``),[O,k]=(0,v.useState)(``),[A,j]=(0,v.useState)(``),[M,N]=(0,v.useState)(!1),[P,F]=(0,v.useState)(!1),[I,L]=(0,v.useState)(!1),[R,z]=(0,v.useState)(!1),[B,V]=(0,v.useState)(``),[H,U]=(0,v.useState)(!1),[W,G]=(0,v.useState)(!1);(0,v.useEffect)(()=>{G(!0),l&&f({to:u?`/`:`/onboarding`})},[l,u,f]);let K=e=>{C(e),V(``),z(!1),U(!1),k(``),j(``),(e===`login`||e===`forgot`)&&T(``)};async function q(n){if(n.preventDefault(),V(``),z(!0),S===`login`){let t=await e(E,O);t.success?await f({to:u?`/`:`/onboarding`}):(V(t.error??`Login failed. Please try again.`),z(!1))}else if(S===`signup`){if(!w.trim()){V(`Please enter your full name.`),z(!1);return}if(O.length<6){V(`Password must be at least 6 characters long.`),z(!1);return}if(O!==A){V(`Passwords do not match.`),z(!1);return}let e=await t(w,E,O);e.success?await f({to:`/onboarding`}):(V(e.error??`Registration failed. Please try again.`),z(!1))}else if(S===`forgot`){let e=await r(E);e.success?U(!0):V(e.error??`Failed to send reset link.`),z(!1)}}async function J(){V(``),z(!0);try{let{data:e,error:t}=await n.auth.signInWithOAuth({provider:`google`,options:{redirectTo:typeof window<`u`?`${window.location.origin}/`:`/`}});if(t)throw t}catch(e){V(e.message||`Failed to sign in with Google. Please try again.`),z(!1)}}function Y(e,t){D(e),k(t),V(``),C(`login`)}return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(`style`,{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .login-root {
          min-height: 100dvh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: hsl(240 10% 3.9%);
        }

        /* Brand panel */
        .login-brand {
          display: none;
          position: relative;
          overflow: hidden;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4c1d95 65%, #1e1b4b 100%);
        }
        @media (min-width: 1024px) {
          .login-brand { display: flex; }
        }

        /* mesh glow orbs */
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.5;
        }
        .login-orb-1 {
          top: -8rem; left: -8rem;
          width: 28rem; height: 28rem;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
        }
        .login-orb-2 {
          bottom: -6rem; right: -6rem;
          width: 22rem; height: 22rem;
          background: radial-gradient(circle, #a855f7 0%, transparent 70%);
        }
        .login-orb-3 {
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 18rem; height: 18rem;
          background: radial-gradient(circle, #818cf8 0%, transparent 70%);
          opacity: 0.25;
        }

        .login-brand-top { position: relative; z-index: 1; }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 3.5rem;
        }
        .login-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem; height: 2.75rem;
          border-radius: 0.875rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .login-logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .login-brand-heading {
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .login-brand-heading span {
          background: linear-gradient(90deg, #a5b4fc, #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .login-brand-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 22rem;
          margin-bottom: 2.5rem;
        }
        .login-features {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .login-feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }
        .login-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem; height: 2rem;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          flex-shrink: 0;
        }

        /* Form panel */
        .login-form-panel {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem 1.5rem;
          background: hsl(240 10% 3.9%);
          overflow-y: auto;
        }
        @media (min-width: 640px) {
          .login-form-panel { padding: 3rem 2.5rem; }
        }

        /* slide-up entrance */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          width: 100%;
          max-width: 26rem;
          opacity: 0;
          animation: slideUp 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .login-card.mounted { opacity: 1; }

        /* mobile-only logo */
        .login-mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        @media (min-width: 1024px) { .login-mobile-logo { display: none; } }
        .login-mobile-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem; height: 2.25rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #6366f1, #a855f7);
        }
        .login-mobile-logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.03em;
          margin: 0 0 0.375rem;
        }
        .login-subtitle {
          font-size: 0.9rem;
          color: hsl(240 5% 64.9%);
          margin: 0 0 2rem;
        }

        /* Demo chips */
        .login-demo-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .login-demo-chip {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.3125rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid hsl(240 3.7% 20%);
          background: hsl(240 3.7% 10%);
          font-size: 0.75rem;
          font-weight: 500;
          color: hsl(240 5% 64.9%);
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: inherit;
        }
        .login-demo-chip:hover {
          border-color: #6366f1;
          color: #a5b4fc;
          background: rgba(99,102,241,0.08);
        }
        .login-demo-chip-dot {
          width: 0.375rem; height: 0.375rem;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
        }

        /* Input group */
        .login-field { margin-bottom: 1.125rem; }
        .login-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }
        .login-input-wrap {
          position: relative;
        }
        .login-input-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(240 5% 44.9%);
          pointer-events: none;
          width: 1rem; height: 1rem;
        }
        .login-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
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
        .login-input::placeholder { color: hsl(240 5% 44.9%); }
        .login-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
        }
        .login-input.has-right { padding-right: 3rem; }
        .login-eye-btn {
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
        .login-eye-btn:hover {
          color: #a5b4fc;
          background: rgba(99,102,241,0.12);
        }

        /* Remember / forgot row */
        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .login-remember {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: hsl(240 5% 64.9%);
          cursor: pointer;
          user-select: none;
        }
        .login-remember input[type="checkbox"] { accent-color: #6366f1; width: 1rem; height: 1rem; cursor: pointer; }
        .login-forgot {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #818cf8;
          text-decoration: none;
          transition: color 0.18s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }
        .login-forgot:hover { color: #a5b4fc; }

        /* Error box */
        .login-error {
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

        /* Success box */
        .login-success-box {
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
        .login-success-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #34d399;
          margin: 0.75rem 0 0.375rem;
        }
        .login-success-desc {
          font-size: 0.875rem;
          color: hsl(240 5% 74.9%);
          line-height: 1.5;
          margin: 0;
        }

        /* Submit button */
        .login-btn {
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
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99, 102, 241, 0.55);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-spinner {
          width: 1.125rem; height: 1.125rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* Google OAuth button */
        .login-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          border-radius: 0.875rem;
          border: 1px solid hsl(240 3.7% 20%);
          background: hsl(240 3.7% 10%);
          color: #f8fafc;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s ease;
          margin-bottom: 1.5rem;
        }
        .login-google-btn:hover:not(:disabled) {
          border-color: #6366f1;
          background: rgba(99,102,241,0.08);
          transform: translateY(-1px);
        }
        .login-google-btn:active:not(:disabled) { transform: translateY(0); }
        .login-google-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .login-google-icon {
          width: 1.25rem; height: 1.25rem;
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: hsl(240 5% 34.9%);
          font-size: 0.75rem;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: hsl(240 3.7% 20%);
        }

        /* Footer */
        .login-footer {
          text-align: center;
          font-size: 0.8125rem;
          color: hsl(240 5% 54.9%);
        }
        .login-footer button, .login-footer a {
          background: none;
          border: none;
          padding: 0;
          color: #818cf8;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
        }
        .login-footer button:hover, .login-footer a:hover { color: #a5b4fc; }

        /* Back to login header action */
        .login-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: hsl(240 5% 64.9%);
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.18s;
          padding: 0;
          margin-bottom: 1.5rem;
          font-family: inherit;
        }
        .login-back-btn:hover {
          color: #f8fafc;
        }

        /* Hide the browser's built-in password reveal eye so only our custom button shows */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-strong-password-auto-fill-button {
          display: none !important;
          visibility: hidden !important;
        }
      `}),(0,y.jsxs)(`div`,{className:`login-root`,children:[(0,y.jsxs)(`div`,{className:`login-brand`,children:[(0,y.jsx)(`div`,{className:`login-orb login-orb-1`}),(0,y.jsx)(`div`,{className:`login-orb login-orb-2`}),(0,y.jsx)(`div`,{className:`login-orb login-orb-3`}),(0,y.jsxs)(`div`,{className:`login-brand-top`,children:[(0,y.jsxs)(`div`,{className:`login-logo`,children:[(0,y.jsx)(`div`,{className:`login-logo-icon`,children:(0,y.jsx)(g,{size:20,color:`#fff`})}),(0,y.jsx)(`span`,{className:`login-logo-text`,children:`Expensia`})]}),(0,y.jsxs)(`h1`,{className:`login-brand-heading`,children:[`Your money,`,(0,y.jsx)(`br`,{}),(0,y.jsx)(`span`,{children:`crystal clear.`})]}),(0,y.jsx)(`p`,{className:`login-brand-sub`,children:`Effortlessly track every rupee, set smart budgets, and get insights that help you spend better — all in one place.`}),(0,y.jsx)(`div`,{className:`login-features`,children:b.map(e=>(0,y.jsxs)(`div`,{className:`login-feature`,children:[(0,y.jsx)(`div`,{className:`login-feature-icon`,children:(0,y.jsx)(e.icon,{size:14,color:`#a5b4fc`})}),e.text]},e.text))})]})]}),(0,y.jsx)(`div`,{className:`login-form-panel`,children:(0,y.jsxs)(`div`,{className:`login-card ${W?`mounted`:``}`,children:[(0,y.jsxs)(`div`,{className:`login-mobile-logo`,children:[(0,y.jsx)(`div`,{className:`login-mobile-logo-icon`,children:(0,y.jsx)(g,{size:18,color:`#fff`})}),(0,y.jsx)(`span`,{className:`login-mobile-logo-text`,children:`Expensia`})]}),S!==`login`&&(0,y.jsxs)(`button`,{type:`button`,className:`login-back-btn`,onClick:()=>K(`login`),children:[(0,y.jsx)(i,{size:16}),`Back to sign in`]}),S===`login`&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(`h2`,{className:`login-title`,children:`Welcome back`}),(0,y.jsx)(`p`,{className:`login-subtitle`,children:`Sign in to continue to your dashboard`})]}),S===`signup`&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(`h2`,{className:`login-title`,children:`Create an account`}),(0,y.jsx)(`p`,{className:`login-subtitle`,children:`Start tracking your expenses and budgeting today`})]}),S===`forgot`&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(`h2`,{className:`login-title`,children:`Forgot password?`}),(0,y.jsx)(`p`,{className:`login-subtitle`,children:H?`Instructions sent`:`Enter your email address and we'll send you a link to reset your password`})]}),S===`login`&&(0,y.jsxs)(`div`,{className:`login-demo-row`,children:[(0,y.jsx)(`span`,{style:{fontSize:`0.75rem`,color:`hsl(240 5% 44.9%)`,alignSelf:`center`},children:`Try demo:`}),x.map(e=>(0,y.jsxs)(`button`,{type:`button`,className:`login-demo-chip`,onClick:()=>Y(e.email,e.password),children:[(0,y.jsx)(`span`,{className:`login-demo-chip-dot`}),e.label]},e.email))]}),S===`forgot`&&H?(0,y.jsxs)(`div`,{className:`login-success-box`,children:[(0,y.jsx)(a,{size:40,className:`text-emerald-500`}),(0,y.jsx)(`h3`,{className:`login-success-title`,children:`Check your inbox`}),(0,y.jsxs)(`p`,{className:`login-success-desc`,children:[`We've sent a password recovery link to `,(0,y.jsx)(`strong`,{children:E}),`.`,(0,y.jsx)(`br`,{}),(0,y.jsx)(`br`,{}),(0,y.jsx)(`strong`,{children:`Note:`}),` Click the link in your email, then come back to this page to stay logged in.`]})]}):(0,y.jsxs)(`form`,{onSubmit:q,noValidate:!0,children:[S===`signup`&&(0,y.jsxs)(`div`,{className:`login-field`,children:[(0,y.jsx)(`label`,{htmlFor:`login-name`,className:`login-label`,children:`Full name`}),(0,y.jsxs)(`div`,{className:`login-input-wrap`,children:[(0,y.jsx)(d,{className:`login-input-icon`}),(0,y.jsx)(`input`,{id:`login-name`,type:`text`,required:!0,placeholder:`John Doe`,value:w,onChange:e=>{T(e.target.value),V(``)},className:`login-input`})]})]}),(0,y.jsxs)(`div`,{className:`login-field`,children:[(0,y.jsx)(`label`,{htmlFor:`login-email`,className:`login-label`,children:`Email address`}),(0,y.jsxs)(`div`,{className:`login-input-wrap`,children:[(0,y.jsx)(c,{className:`login-input-icon`}),(0,y.jsx)(`input`,{id:`login-email`,type:`email`,autoComplete:`email`,required:!0,placeholder:`you@example.com`,value:E,onChange:e=>{D(e.target.value),V(``)},className:`login-input`,inputMode:`email`})]})]}),S!==`forgot`&&(0,y.jsxs)(`div`,{className:`login-field`,children:[(0,y.jsx)(`label`,{htmlFor:`login-password`,className:`login-label`,children:`Password`}),(0,y.jsxs)(`div`,{className:`login-input-wrap`,children:[(0,y.jsx)(m,{className:`login-input-icon`}),(0,y.jsx)(`input`,{id:`login-password`,type:M?`text`:`password`,autoComplete:S===`login`?`current-password`:`new-password`,required:!0,placeholder:`••••••••`,value:O,onChange:e=>{k(e.target.value),V(``)},className:`login-input has-right`}),(0,y.jsx)(`button`,{type:`button`,className:`login-eye-btn`,onClick:()=>N(e=>!e),"aria-label":M?`Hide password`:`Show password`,children:M?(0,y.jsx)(o,{size:16}):(0,y.jsx)(s,{size:16})})]})]}),S===`signup`&&(0,y.jsxs)(`div`,{className:`login-field`,children:[(0,y.jsx)(`label`,{htmlFor:`login-confirm-password`,className:`login-label`,children:`Confirm password`}),(0,y.jsxs)(`div`,{className:`login-input-wrap`,children:[(0,y.jsx)(m,{className:`login-input-icon`}),(0,y.jsx)(`input`,{id:`login-confirm-password`,type:P?`text`:`password`,autoComplete:`new-password`,required:!0,placeholder:`••••••••`,value:A,onChange:e=>{j(e.target.value),V(``)},className:`login-input has-right`}),(0,y.jsx)(`button`,{type:`button`,className:`login-eye-btn`,onClick:()=>F(e=>!e),"aria-label":P?`Hide password`:`Show password`,children:P?(0,y.jsx)(o,{size:16}):(0,y.jsx)(s,{size:16})})]})]}),S===`login`&&(0,y.jsxs)(`div`,{className:`login-row`,children:[(0,y.jsxs)(`label`,{className:`login-remember`,children:[(0,y.jsx)(`input`,{type:`checkbox`,checked:I,onChange:e=>L(e.target.checked)}),`Remember me`]}),(0,y.jsx)(`button`,{type:`button`,className:`login-forgot`,onClick:()=>K(`forgot`),children:`Forgot password?`})]}),B&&(0,y.jsxs)(`div`,{className:`login-error`,role:`alert`,children:[(0,y.jsx)(`span`,{children:`⚠`}),B]}),(0,y.jsx)(`button`,{id:`login-submit-btn`,type:`submit`,className:`login-btn`,disabled:R||!E||S!==`forgot`&&!O||S===`signup`&&(!w||!A),children:R?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(`span`,{className:`login-spinner`}),S===`login`?`Signing in...`:S===`signup`?`Creating account...`:`Sending...`]}):(0,y.jsxs)(y.Fragment,{children:[S===`login`?`Sign in`:S===`signup`?`Create account`:`Send recovery link`,(0,y.jsx)(p,{size:17})]})}),(0,y.jsx)(`div`,{className:`login-divider`,children:`or continue with`}),S===`login`&&(0,y.jsxs)(`button`,{type:`button`,className:`login-google-btn`,onClick:J,disabled:R,children:[(0,y.jsxs)(`svg`,{className:`login-google-icon`,viewBox:`0 0 24 24`,children:[(0,y.jsx)(`path`,{fill:`#4285F4`,d:`M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z`}),(0,y.jsx)(`path`,{fill:`#34A853`,d:`M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z`}),(0,y.jsx)(`path`,{fill:`#FBBC05`,d:`M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z`}),(0,y.jsx)(`path`,{fill:`#EA4335`,d:`M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z`})]}),`Sign in with Google`]}),(0,y.jsx)(`div`,{className:`login-divider`,children:`or`}),(0,y.jsx)(`p`,{className:`login-footer`,children:S===`login`?(0,y.jsxs)(y.Fragment,{children:[`Don't have an account?`,` `,(0,y.jsx)(`button`,{type:`button`,onClick:()=>K(`signup`),children:`Create one free`})]}):(0,y.jsxs)(y.Fragment,{children:[`Already have an account?`,` `,(0,y.jsx)(`button`,{type:`button`,onClick:()=>K(`login`),children:`Sign in instead`})]})})]})]})})]})]})}export{S as component};
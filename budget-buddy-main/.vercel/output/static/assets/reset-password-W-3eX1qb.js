import{i as e,t}from"./jsx-runtime-DUAcabCT.js";import{n,s as r}from"./createLucideIcon-2NVixTfB.js";import{t as i}from"./arrow-left-BQSYrU9G.js";import{t as a}from"./circle-check-BNe4cZB7.js";import{n as o,t as s}from"./eye-QsoMlfMv.js";import{M as c,f as l,k as u,tt as d}from"./index-B4kx1lb7.js";var f=e(r()),p=t();function m(){let e=d(),[t,r]=(0,f.useState)(``),[m,h]=(0,f.useState)(``),[g,_]=(0,f.useState)(!1),[v,y]=(0,f.useState)(!1),[b,x]=(0,f.useState)(!1),[S,C]=(0,f.useState)(``),[w,T]=(0,f.useState)(!1),[E,D]=(0,f.useState)(!1),[O,k]=(0,f.useState)(!1);(0,f.useEffect)(()=>(D(!0),n.auth.getSession().then(({data:{session:t}})=>{t?(k(!0),typeof window<`u`&&sessionStorage.setItem(`password_reset_in_progress`,`true`)):(l.error(`Invalid or expired reset link. Please request a new password reset.`),setTimeout(()=>{e({to:`/login`})},2e3))}),()=>{typeof window<`u`&&sessionStorage.removeItem(`password_reset_in_progress`)}),[e]);async function A(r){if(r.preventDefault(),C(``),x(!0),t.length<6){C(`Password must be at least 6 characters long`),x(!1);return}if(t!==m){C(`Passwords do not match`),x(!1);return}try{let{error:r}=await n.auth.updateUser({password:t});if(r)throw r;T(!0),l.success(`Password updated successfully!`),sessionStorage.removeItem(`password_reset_in_progress`),await n.auth.signOut(),setTimeout(()=>{e({to:`/login`})},2e3)}catch(e){C(e.message||`Failed to update password`),l.error(`Failed to update password`)}finally{x(!1)}}return O?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(`style`,{children:`
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
      `}),(0,p.jsx)(`div`,{className:`reset-root`,children:(0,p.jsxs)(`div`,{className:`reset-card ${E?`mounted`:``}`,children:[(0,p.jsxs)(`div`,{className:`reset-logo`,children:[(0,p.jsx)(`div`,{className:`reset-logo-icon`,children:(0,p.jsx)(u,{size:18,color:`#fff`})}),(0,p.jsx)(`span`,{className:`reset-logo-text`,children:`Expensia`})]}),w?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(`div`,{className:`reset-success-box`,children:[(0,p.jsx)(a,{size:40,className:`text-emerald-500`}),(0,p.jsx)(`h3`,{className:`reset-success-title`,children:`Password Updated!`}),(0,p.jsx)(`p`,{className:`reset-success-desc`,children:`Your password has been successfully updated. You'll be redirected to the login page shortly.`})]}),(0,p.jsxs)(`button`,{type:`button`,className:`reset-back-btn`,onClick:()=>{sessionStorage.removeItem(`password_reset_in_progress`),e({to:`/login`})},children:[(0,p.jsx)(i,{size:16}),`Back to sign in`]})]}):(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(`h2`,{className:`reset-title`,children:`Reset your password`}),(0,p.jsx)(`p`,{className:`reset-subtitle`,children:`Enter your new password below`}),(0,p.jsxs)(`form`,{onSubmit:A,noValidate:!0,children:[(0,p.jsxs)(`div`,{className:`reset-field`,children:[(0,p.jsx)(`label`,{htmlFor:`new-password`,className:`reset-label`,children:`New Password`}),(0,p.jsxs)(`div`,{className:`reset-input-wrap`,children:[(0,p.jsx)(c,{className:`reset-input-icon`}),(0,p.jsx)(`input`,{id:`new-password`,type:g?`text`:`password`,autoComplete:`new-password`,required:!0,placeholder:`••••••••`,value:t,onChange:e=>{r(e.target.value),C(``)},className:`reset-input`}),(0,p.jsx)(`button`,{type:`button`,className:`reset-eye-btn`,onClick:()=>_(e=>!e),"aria-label":g?`Hide password`:`Show password`,children:g?(0,p.jsx)(o,{size:16}):(0,p.jsx)(s,{size:16})})]}),(0,p.jsx)(`p`,{className:`reset-hint`,children:`Must be at least 6 characters long`})]}),(0,p.jsxs)(`div`,{className:`reset-field`,children:[(0,p.jsx)(`label`,{htmlFor:`confirm-password`,className:`reset-label`,children:`Confirm New Password`}),(0,p.jsxs)(`div`,{className:`reset-input-wrap`,children:[(0,p.jsx)(c,{className:`reset-input-icon`}),(0,p.jsx)(`input`,{id:`confirm-password`,type:v?`text`:`password`,autoComplete:`new-password`,required:!0,placeholder:`••••••••`,value:m,onChange:e=>{h(e.target.value),C(``)},className:`reset-input`}),(0,p.jsx)(`button`,{type:`button`,className:`reset-eye-btn`,onClick:()=>y(e=>!e),"aria-label":v?`Hide password`:`Show password`,children:v?(0,p.jsx)(o,{size:16}):(0,p.jsx)(s,{size:16})})]})]}),S&&(0,p.jsxs)(`div`,{className:`reset-error`,role:`alert`,children:[(0,p.jsx)(`span`,{children:`⚠`}),S]}),(0,p.jsx)(`button`,{type:`submit`,className:`reset-btn`,disabled:b||!t||!m,children:b?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(`div`,{className:`reset-spinner`}),`Updating password...`]}):(0,p.jsxs)(p.Fragment,{children:[`Update Password`,(0,p.jsx)(c,{size:16})]})}),(0,p.jsxs)(`button`,{type:`button`,className:`reset-back-btn`,onClick:()=>{sessionStorage.removeItem(`password_reset_in_progress`),e({to:`/login`})},children:[(0,p.jsx)(i,{size:16}),`Back to sign in`]})]})]})]})})]}):(0,p.jsx)(`div`,{style:{minHeight:`100dvh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`hsl(240 10% 3.9%)`,color:`#f8fafc`,fontFamily:`'Inter', sans-serif`},children:(0,p.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,p.jsx)(`div`,{style:{width:`48px`,height:`48px`,border:`3px solid rgba(99, 102, 241, 0.3)`,borderTopColor:`#6366f1`,borderRadius:`50%`,animation:`spin 0.8s linear infinite`,margin:`0 auto 16px`}}),(0,p.jsx)(`p`,{children:`Verifying reset link...`})]})})}export{m as component};
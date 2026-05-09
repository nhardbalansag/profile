import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TbTransfer } from "react-icons/tb";
import { LuHandshake } from "react-icons/lu";
import { PiBankBold } from "react-icons/pi";
import { LuQrCode } from "react-icons/lu";
import { TbWorldDollar } from "react-icons/tb";
import { BsBarChartLine } from "react-icons/bs";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { MdOutlineRedeem } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";
import { format } from 'date-fns';
import QRCode from "react-qr-code";

import * as api_orders from '../../services/account/orders.api.js';
import * as api_account from '../../services/account/account.api.js';
import * as api_subscription from '../../services/account/subscription.api.js';

const env = import.meta.env;
const VITE_APP_PORTAL = env.VITE_APP_PORTAL;

/* ─────────────────────────────────────────────
   Design tokens & global styles — LIGHT MODE
───────────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  :root {
    /* surfaces */
    --bg:         #f4f6fb;
    --surface:    #ffffff;
    --surface2:   #f8f9fc;
    --surface3:   #eef1f8;

    /* brand — deep navy + indigo */
    --brand:      #1e3a8a;
    --brand2:     #2563eb;
    --brand3:     #3b82f6;
    --brand-lt:   #eff6ff;
    --brand-mid:  #dbeafe;

    /* text */
    --text:       #0f172a;
    --text2:      #334155;
    --text3:      #64748b;
    --text4:      #94a3b8;

    /* borders */
    --border:     #e2e8f0;
    --border2:    #cbd5e1;
    --border3:    #bfcfe8;

    /* semantic */
    --green:      #16a34a;
    --green-lt:   #f0fdf4;
    --green-mid:  #bbf7d0;
    --red:        #dc2626;
    --red-lt:     #fef2f2;
    --red-mid:    #fecaca;
    --amber:      #d97706;
    --amber-lt:   #fffbeb;
    --purple:     #7c3aed;
    --purple-lt:  #f5f3ff;

    --radius-sm:  8px;
    --radius-md:  12px;
    --radius-lg:  16px;
    --radius-xl:  20px;
    --shadow-sm:  0 1px 3px rgba(15,23,42,.07), 0 1px 2px rgba(15,23,42,.05);
    --shadow-md:  0 4px 16px rgba(15,23,42,.08), 0 1px 4px rgba(15,23,42,.04);
    --shadow-lg:  0 8px 32px rgba(15,23,42,.1),  0 2px 8px rgba(15,23,42,.06);
    font-family: 'DM Sans', sans-serif;
  }

  .ac-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .ac-root {
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Scrollbar ── */
  .ac-root ::-webkit-scrollbar { width: 4px; height: 4px; }
  .ac-root ::-webkit-scrollbar-track { background: var(--surface3); }
  .ac-root ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── Layout ── */
  .ac-wrap {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 16px 80px;
  }

  .ac-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    margin-bottom: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .ac-logo-mark {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: .06em;
    color: var(--brand);
    line-height: 1;
  }
  .ac-logo-sub {
    font-size: 10px;
    color: var(--text4);
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .ac-badge-status {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--green-lt);
    border: 1px solid var(--green-mid);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--green);
  }
  .ac-badge-status::before {
    content: '';
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse-dot 2s infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.5; transform:scale(1.3); }
  }

  .ac-main-grid {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── Cards ── */
  .ac-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px;
    box-shadow: var(--shadow-sm);
  }
  .ac-card-raised {
    background: var(--brand);
    border: 1px solid rgba(30,58,138,.15);
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-lg);
  }
  .ac-card-gold {
    background: linear-gradient(135deg, var(--brand-lt) 0%, #f0f7ff 100%);
    border: 1px solid var(--brand-mid);
    border-radius: var(--radius-lg);
    padding: 18px;
  }

  /* ── Section titles ── */
  .ac-section-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--text4);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* ── Separator ── */
  .ac-sep {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }

  /* ── Sponsor card ── */
  .ac-sponsor {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .ac-avatar {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand) 0%, var(--brand2) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px var(--brand-mid);
  }
  .ac-sponsor-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
  }
  .ac-sponsor-detail {
    font-size: 12px;
    color: var(--text3);
    margin-top: 2px;
  }

  /* ── Account number badge ── */
  .ac-acct-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .ac-acct-badge {
    background: var(--brand-lt);
    border: 1px solid var(--brand-mid);
    border-radius: var(--radius-sm);
    padding: 7px 16px;
    font-size: 15px;
    font-weight: 500;
    font-family: 'DM Mono', monospace;
    color: var(--brand);
    letter-spacing: .07em;
  }

  /* ── QR Panel ── */
  .ac-qr-panel {
    overflow: hidden;
    max-height: 0;
    transition: max-height .4s cubic-bezier(.4,0,.2,1), opacity .3s;
    opacity: 0;
  }
  .ac-qr-panel.open {
    max-height: 340px;
    opacity: 1;
  }
  .ac-qr-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 20px;
    margin-top: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  .ac-qr-label {
    font-size: 12px;
    color: var(--text3);
    letter-spacing: .04em;
  }
  .ac-qr-inner svg rect:first-child { fill: #fff; border-radius: 8px; }

  /* ── Wallet tabs ── */
  .ac-wallet-tabs {
    display: flex;
    gap: 3px;
    background: var(--surface3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 3px;
    margin-bottom: 14px;
  }
  .ac-w-tab {
    flex: 1;
    padding: 7px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    border: none;
    background: transparent;
    color: var(--text3);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all .2s;
    white-space: nowrap;
  }
  .ac-w-tab.active {
    background: var(--surface);
    color: var(--brand);
    box-shadow: var(--shadow-sm);
    font-weight: 600;
  }

  /* ── Wallet card ── */
  .ac-wallet-slide {
    display: none;
  }
  .ac-wallet-slide.active {
    display: block;
    animation: slide-in .22s ease;
  }
  @keyframes slide-in {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .ac-balance-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,.6);
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .ac-balance-num {
    font-size: 36px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    color: #ffffff;
    line-height: 1.1;
    margin: 6px 0 2px;
    letter-spacing: -.01em;
  }
  .ac-balance-currency {
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,.5);
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .ac-wallet-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  /* ── Buttons ── */
  .ac-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all .18s;
    border: 1px solid var(--brand2);
    background: var(--brand2);
    color: #ffffff;
    white-space: nowrap;
  }
  .ac-btn:hover {
    background: var(--brand);
    border-color: var(--brand);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37,99,235,.3);
  }
  .ac-btn:active { transform: translateY(0) scale(.98); }

  /* White variant — used inside the dark wallet card */
  .ac-btn-white {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all .18s;
    border: 1px solid rgba(255,255,255,.4);
    background: rgba(255,255,255,.15);
    color: #ffffff;
    white-space: nowrap;
  }
  .ac-btn-white:hover {
    background: rgba(255,255,255,.25);
    border-color: rgba(255,255,255,.7);
    transform: translateY(-1px);
  }
  .ac-btn-white:active { transform: translateY(0) scale(.98); }

  .ac-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all .18s;
    border: 1px solid var(--border2);
    background: var(--surface);
    color: var(--text2);
    white-space: nowrap;
  }
  .ac-btn-ghost:hover {
    border-color: var(--brand3);
    color: var(--brand);
    background: var(--brand-lt);
  }

  .ac-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--brand-lt);
    border: 1px solid var(--brand-mid);
    color: var(--brand2);
    cursor: pointer;
    transition: all .18s;
    flex-shrink: 0;
  }
  .ac-icon-btn:hover {
    background: var(--brand-mid);
    border-color: var(--brand3);
  }

  /* ── Finance summary ── */
  .ac-fin-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .ac-fin-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 14px;
    cursor: pointer;
    transition: border-color .2s, transform .2s, box-shadow .2s;
  }
  .ac-fin-card:hover {
    border-color: var(--brand3);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  .ac-fin-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
  }
  .ac-fin-icon.gold   { background: var(--brand-lt);   color: var(--brand2); }
  .ac-fin-icon.blue   { background: #e0f2fe;            color: #0284c7; }
  .ac-fin-icon.green  { background: var(--green-lt);    color: var(--green); }
  .ac-fin-icon.purple { background: var(--purple-lt);   color: var(--purple); }

  .ac-fin-label {
    font-size: 11px;
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: .08em;
    font-weight: 600;
  }
  .ac-fin-num {
    font-size: 18px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    color: var(--text);
    margin: 5px 0;
  }
  .ac-tag-green {
    display: inline-block;
    background: var(--green-lt);
    color: var(--green);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .ac-tag-red {
    display: inline-block;
    background: var(--red-lt);
    color: var(--red);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .ac-tag-muted {
    display: inline-block;
    background: var(--surface3);
    color: var(--text4);
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 20px;
  }

  /* ── Transaction history ── */
  .ac-tx-filters {
    display: flex;
    gap: 4px;
    background: var(--surface3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 3px;
    margin-bottom: 14px;
    width: fit-content;
  }
  .ac-tx-tab {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    border: none;
    background: transparent;
    color: var(--text3);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all .18s;
  }
  .ac-tx-tab.active {
    background: var(--surface);
    color: var(--brand);
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }

  .ac-tx-list { }
  .ac-tx-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0;
    border-bottom: 1px solid var(--border);
    transition: opacity .15s;
  }
  .ac-tx-row:last-child { border-bottom: none; }
  .ac-tx-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 12px;
    margin-top: 4px;
  }
  .ac-tx-dot.credit { background: var(--green); }
  .ac-tx-dot.debit  { background: var(--red); }

  .ac-tx-left { display: flex; align-items: flex-start; }
  .ac-tx-type { font-size: 14px; font-weight: 500; color: var(--text); line-height: 1.3; }
  .ac-tx-date { font-size: 11px; color: var(--text4); margin-top: 2px; font-family: 'DM Mono', monospace; }
  .ac-tx-right { text-align: right; }
  .ac-tx-amt {
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
  }
  .ac-tx-amt.plus  { color: var(--green); }
  .ac-tx-amt.minus { color: var(--red); }
  .ac-tx-currency { font-size: 10px; color: var(--text4); margin-top: 2px; letter-spacing: .06em; font-weight: 500; }

  .ac-tx-pagination {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  /* ── Skeleton loader ── */
  .ac-skeleton {
    background: linear-gradient(90deg, var(--surface3) 25%, var(--border) 50%, var(--surface3) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
    border-radius: var(--radius-sm);
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Quick actions ── */
  .ac-qa-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .ac-qa-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 14px;
    cursor: pointer;
    transition: border-color .2s, transform .2s, box-shadow .2s;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    box-shadow: var(--shadow-sm);
  }
  .ac-qa-card:hover {
    border-color: var(--brand3);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  .ac-qa-label { font-size: 13px; font-weight: 600; margin-top: 8px; color: var(--text); }
  .ac-qa-sub   { font-size: 11px; color: var(--text3); margin-top: 2px; }

  /* ── Modal ── */
  .ac-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(15,23,42,.5);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fade-in .2s;
  }
  @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
  .ac-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 28px 24px;
    max-width: 340px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    animation: modal-in .25s cubic-bezier(.34,1.3,.64,1);
  }
  @keyframes modal-in {
    from { opacity:0; transform:scale(.92) translateY(16px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  .ac-modal-close {
    position: absolute;
    top: 12px; right: 12px;
    background: var(--surface3);
    border: 1px solid var(--border);
    border-radius: 50%;
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: var(--text3);
    font-size: 16px;
    transition: all .18s;
  }
  .ac-modal-close:hover { background: var(--border); color: var(--text); }

  /* ── Upgrade modal ── */
  .ac-upgrade-icon {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand) 0%, var(--brand2) 100%);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    box-shadow: 0 0 0 8px var(--brand-lt), 0 8px 24px rgba(37,99,235,.25);
  }
  .ac-upgrade-title {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    color: var(--text);
    line-height: 1.3;
    margin-bottom: 8px;
  }
  .ac-upgrade-sub {
    font-size: 13px;
    color: var(--text3);
    text-align: center;
    line-height: 1.5;
    margin-bottom: 20px;
  }
  .ac-upgrade-btn {
    display: block;
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, var(--brand) 0%, var(--brand2) 100%);
    border: none;
    border-radius: var(--radius-md);
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    letter-spacing: .02em;
    transition: opacity .18s, transform .18s;
    box-shadow: 0 4px 14px rgba(37,99,235,.35);
  }
  .ac-upgrade-btn:hover { opacity: .9; transform: translateY(-1px); }

  /* ────────────────────────────
     RESPONSIVE BREAKPOINTS
  ──────────────────────────── */
  @media (max-width: 860px) {
    .ac-main-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 540px) {
    .ac-wrap { padding: 16px 12px 100px; }
    .ac-balance-num { font-size: 28px; }
    .ac-fin-grid { grid-template-columns: 1fr 1fr; }
    .ac-qa-grid  { grid-template-columns: 1fr 1fr; }
    .ac-topbar { padding-bottom: 16px; margin-bottom: 18px; }
    .ac-modal { padding: 22px 18px; }
  }

  /* ── Mobile bottom nav placeholder ── */
  @media (max-width: 640px) {
    .ac-desktop-only { display: none; }
  }
  @media (min-width: 641px) {
    .ac-mobile-only { display: none !important; }
  }
`;

/* ─── Icon components ─── */
const IconTransfer = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/>
    <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
  </svg>
);
const IconBank = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);
const IconGift = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
);
const IconQr = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="4" height="4" rx="1"/>
  </svg>
);
const IconShare = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
    <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);
const IconUsers = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconChart = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconLink = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconUpgrade = () => (
  <svg width="28" height="28" fill="none" stroke="#ffffff" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

/* ─── Skeleton row ─── */
const SkeletonRow = () => (
  <div className="ac-tx-row" style={{ gap: 12 }}>
    <div className="ac-skeleton" style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div className="ac-skeleton" style={{ height: 13, width: '55%', marginBottom: 6 }} />
      <div className="ac-skeleton" style={{ height: 10, width: '30%' }} />
    </div>
    <div style={{ textAlign: 'right' }}>
      <div className="ac-skeleton" style={{ height: 13, width: 70, marginLeft: 'auto', marginBottom: 6 }} />
      <div className="ac-skeleton" style={{ height: 10, width: 50, marginLeft: 'auto' }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const AccountContent = () => {
  const navigate = useNavigate();
  const auth_states = useSelector(state => state.AuthReducer);
  const modalSubscriptionRef = useRef(null);

  const [paginate, setPaginate]     = useState(null);
  const [activeWallet, setActiveWallet] = useState(0);
  const [activeTxTab, setActiveTxTab]   = useState('all');
  const [showQr, setShowQr]             = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [getPaginationButtonNextPrev, setPaginationButtonNextPrev] = useState({
    prev_page_url: null, first_page_url: null, last_page_url: null,
    next_page_url: null, current_page: null, last_page: null,
    total: 0, from: 0, to: 0, data: []
  });

  const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([]);
  const [loadingContent, setLoadingContent]   = useState(true);
  const [requestLoading, setRequestLoading]   = useState(false);

  const [walletData, setWalletData] = useState({
    t_points: 0, t_bucks: 0, t_dollars: 0, direct: 0,
    total_direct_commission: 0, total_stars_commission: 0,
    AccountTransaction: [], sponsor: null
  });

  const [getLegacyCommissionTotal, setLegacyCommissionTotal] = useState({
    market: 0, direct: 0
  });

  /* ── Language translation ── */
  useEffect(() => {
    auth_states.PageLanguages?.forEach((item) => {
      const translation = item.translation;
      if (translation.length > 0 && auth_states.SelectedLanguage) {
        const ft = translation.find(t => t.language_id == auth_states.SelectedLanguage.id);
        const els = document.getElementsByClassName(item.page_config_id);
        Array.from(els).forEach(el => {
          el.textContent = ft ? ft.page_config_title : item.page_config_title;
        });
      }
    });
  }, [auth_states, getPaginationButtonNextPrev]);

  /* ── Data fetches ── */
  const getTBucksAndTPoints = async () => {
    setLoadingContent(true);
    try {
      const result = await api_account.getTBucksAndTPoints(auth_states.StateToken);
      if (result.status) {
        Object.keys(result.data.data).forEach(key => {
          setWalletData(prev => ({ ...prev, [key]: result.data.data[key] }));
        });
      }
    } catch (e) { /* silent */ }
    setLoadingContent(false);
  };

  const getLegacyCommissionsTotalCommission = async () => {
    try {
      const result = await api_account.getLegacyCommissionsTotalCommission(auth_states.StateToken);
      if (result.status) {
        Object.keys(result.data.data).forEach(key => {
          setLegacyCommissionTotal(prev => ({ ...prev, [key]: result.data.data[key] }));
        });
      }
    } catch (e) { /* silent */ }
  };

  const getPaginatedContent = async () => {
    setRequestLoading(true);
    try {
      const result = await api_account.getAccountTransaction(auth_states.StateToken, paginate);
      if (result.status) {
        Object.keys(result.data.data).forEach(key => {
          setPaginationButtonNextPrev(prev => ({ ...prev, [key]: result.data.data[key] }));
        });
      }
    } catch (e) { /* silent */ }
    setRequestLoading(false);
  };

  const GetUserAccountSubscriptionDetails = async () => {
    setRequestLoading(true);
    try {
      const result = await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken);
      SetAccountSubscriptionDetails(result.data.data);
    } catch (e) { /* silent */ }
    setRequestLoading(false);
  };

  useEffect(() => {
    getTBucksAndTPoints();
    GetUserAccountSubscriptionDetails();
    getLegacyCommissionsTotalCommission();
  }, []);

  useEffect(() => { getPaginatedContent(); }, [paginate]);

  /* ── Validate T-Points transfer ── */
  const validateTPointsTransfer = () => {
    const isPaid = AccountSubscriptionDetails?.details?.subscription_category
      ?.membership_type?.translation?.membership?.is_paid_account;
    if (!isPaid) {
      setShowUpgradeModal(true);
    } else {
      navigate('/t-points-transfer');
    }
  };

  /* ── Share ── */
  const handleShare = async () => {
    const shareUrl = `${VITE_APP_PORTAL}login?sponsor=${auth_states.payload}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'CLUB TEN Referral', url: shareUrl }); }
      catch (e) { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      } catch (e) { alert('Copy manually:\n' + shareUrl); }
    }
  };

  /* ── Derived values ── */
  const walletSlides = [
    {
      id: 0, label: 'T-Points', amount: walletData.t_points,
      currency: 'T-POINTS',
      actions: [
        { label: 'Transfer', icon: <IconTransfer />, onClick: validateTPointsTransfer }
      ]
    },
    {
      id: 1, label: 'T-Bucks', amount: walletData.t_bucks,
      currency: 'T-BUCKS',
      actions: [
        { label: 'Transfer', icon: <IconTransfer />, onClick: () => navigate('/t-bucks-transfer') },
        { label: 'Withdraw', icon: <IconBank />, ghost: true, onClick: () => navigate('/t-bucks-withdraw') }
      ]
    },
    {
      id: 2, label: 'Travel $', amount: walletData.t_dollars,
      currency: 'TRAVEL DOLLARS',
      actions: [
        { label: 'Redeem', icon: <IconGift />, onClick: () => {} }
      ]
    }
  ];

  const totalDirect = parseFloat(
    parseFloat(getLegacyCommissionTotal.direct || 0) +
    parseFloat(walletData.total_direct_commission || 0)
  ).toFixed(2);
  const totalStars = parseFloat(
    parseFloat(getLegacyCommissionTotal.market || 0) +
    parseFloat(walletData.total_stars_commission || 0)
  ).toFixed(2);

  const financeCards = [
    {
      label: 'Direct Bonus', num: `$${totalDirect}`,
      tag: '+0.0%', tagType: 'green', iconCls: 'gold', Icon: IconUsers,
      onClick: () => navigate('/connects')
    },
    {
      label: 'Stars Bonus', num: `$${totalStars}`,
      tag: '-0.0%', tagType: 'red', iconCls: 'blue', Icon: IconStar,
      onClick: () => navigate('/commissions')
    },
    {
      label: 'Global Bonus', num: '$0.00',
      tag: '—', tagType: 'muted', iconCls: 'green', Icon: IconChart,
      onClick: () => {}
    },
    {
      label: 'Milestone Bonus', num: '$0.00',
      tag: '—', tagType: 'muted', iconCls: 'purple', Icon: BsBarChartLine,
      onClick: () => {}
    }
  ];

  const getTxLabel = (type) => {
    if (type === 'direct') return 'Direct Commission';
    if (type === 'star')   return 'Star Commission';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const filteredTx = getPaginationButtonNextPrev.data.filter(item => {
    if (activeTxTab === 'all')    return true;
    if (activeTxTab === 'credit') return item.is_credit;
    if (activeTxTab === 'debit')  return item.is_debit;
    return true;
  });

  const sponsorName = walletData.sponsor?.users_table?.nick_names || '—';
  const sponsorAcct = walletData.sponsor?.account_number || '—';
  const sponsorEmail = walletData.sponsor?.users_table?.email || '—';
  const sponsorPhone = walletData.sponsor?.users_table?.mobile_number || '—';
  const userAcct = auth_states.StateUserInformation?.accounts_table?.account_number || '';
  const userDisplayName = auth_states.StateUserInformation?.nick_names
    || auth_states.StateUserInformation?.first_name
    || 'Member';
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  /* ─── Render ─── */
  return (
    <>
      {/* Inject global styles once */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLE }} />

      <div className="ac-root">
        <div className="ac-wrap">

          {/* ── Top bar ── */}
          <div className="ac-topbar">
            <div>
              <div className="ac-logo-mark">CLUB TEN</div>
              <div className="ac-logo-sub">Member Dashboard</div>
            </div>
            {/* <div className="ac-badge-status">Active VIP</div> */}
            <div className="ac-badge-status active_label_id">Active</div>
          </div>

          {/* ── Main grid ── */}
          <div className="ac-main-grid">

            {/* ════════ LEFT COLUMN ════════ */}
            <div>

              {/* ── Sponsor card ── */}
              <p className="ac-section-title your_wallet_label_id">your wallet</p>
              <div className="ac-card-gold">
                {loadingContent ? (
                  <div>
                    <div className="ac-skeleton" style={{ height: 12, width: '40%', marginBottom: 10 }} />
                    <div className="ac-skeleton" style={{ height: 12, width: '60%', marginBottom: 6 }} />
                    <div className="ac-skeleton" style={{ height: 12, width: '50%' }} />
                  </div>
                ) : (
                  <div className="ac-sponsor">
                    <div className="ac-avatar">{sponsorName.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span className="ac-sponsor-detail your_sponsor_label_id" style={{ fontWeight: 400 }}>Your Sponsor:</span>
                        <span className="ac-sponsor-name">
                          {sponsorAcct}&nbsp;
                          {walletData.sponsor?.users_table?.nick_names || ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <span className="ac-sponsor-detail phone_label_id">Phone:</span>
                        <span className="ac-sponsor-detail" style={{ color: 'var(--text2)', fontWeight: 500 }}>
                          {walletData.sponsor?.users_table?.mobile_number || '--'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <span className="ac-sponsor-detail email_label_id">Email:</span>
                        <span className="ac-sponsor-detail" style={{ color: 'var(--text2)', fontWeight: 500 }}>
                          {walletData.sponsor?.users_table?.email || '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="ac-sep" />

              {/* ── Account number + QR ── */}
              <div className="ac-acct-row">
                <div>
                  <div className="ac-section-title account_number_label_id" style={{ marginBottom: 6 }}>account number</div>
                  <div className="ac-acct-badge">{userAcct}</div>
                </div>
                <button className="ac-btn" onClick={() => setShowQr(v => !v)}>
                  <IconQr />
                  {showQr ? 'Hide QR' : 'Show QR'}
                </button>
              </div>

              {/* ── QR panel ── */}
              <div className={`ac-qr-panel ${showQr ? 'open' : ''}`}>
                <div className="ac-qr-inner">
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{userDisplayName}</div>
                  <div className="ac-qr-label">{userAcct}</div>
                  <div style={{ background: '#fff', padding: 10, borderRadius: 8 }}>
                    <QRCode
                      value={`${VITE_APP_PORTAL}login?sponsor=${userAcct}`}
                      size={140}
                      viewBox="0 0 256 256"
                    />
                  </div>
                  <button className="ac-btn" onClick={handleShare}>
                    <IconShare />
                    <span className="share_label_id">Share</span>
                  </button>
                </div>
              </div>

              <div className="ac-sep" />

              {/* ── Wallet tabs ── */}
              <div className="ac-wallet-tabs">
                <button
                  className={`ac-w-tab${activeWallet === 0 ? ' active' : ''}`}
                  onClick={() => setActiveWallet(0)}
                >
                  <span className="tpoints_label_id">T-Points</span>
                </button>
                <button
                  className={`ac-w-tab${activeWallet === 1 ? ' active' : ''}`}
                  onClick={() => setActiveWallet(1)}
                >
                  <span className="tbucks_label_id">T-Bucks</span>
                </button>
                <button
                  className={`ac-w-tab${activeWallet === 2 ? ' active' : ''}`}
                  onClick={() => setActiveWallet(2)}
                >
                  <span className="travel_dollars_label_id">Travel $</span>
                </button>
              </div>

              {/* ── T-Points slide ── */}
              {loadingContent ? (
                <div className="ac-card">
                  <div className="ac-skeleton" style={{ height: 11, width: '30%', marginBottom: 10 }} />
                  <div className="ac-skeleton" style={{ height: 36, width: '55%', marginBottom: 8 }} />
                  <div className="ac-skeleton" style={{ height: 11, width: '20%', marginBottom: 18 }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div className="ac-skeleton" style={{ height: 36, width: 100, borderRadius: 8 }} />
                    <div className="ac-skeleton" style={{ height: 36, width: 100, borderRadius: 8 }} />
                  </div>
                </div>
              ) : (
                <>
                  {/* T-Points */}
                  <div className={`ac-wallet-slide${activeWallet === 0 ? ' active' : ''}`}>
                    <div className="ac-card-raised">
                      <p className="ac-balance-label balance_label_id">balance</p>
                      <div className="ac-balance-num">{parseFloat(walletData.t_points).toFixed(2)}</div>
                      <div className="ac-balance-currency tpoints_label_id">T-POINTS</div>
                      <div className="ac-wallet-actions">
                        <button className="ac-btn-white" onClick={validateTPointsTransfer}>
                          <TbTransfer />
                          <span className="transfer_label_id">Transfer</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* T-Bucks */}
                  <div className={`ac-wallet-slide${activeWallet === 1 ? ' active' : ''}`}>
                    <div className="ac-card-raised">
                      <p className="ac-balance-label balance_label_id">balance</p>
                      <div className="ac-balance-num">{parseFloat(walletData.t_bucks).toFixed(2)}</div>
                      <div className="ac-balance-currency tbucks_label_id">T-BUCKS</div>
                      <div className="ac-wallet-actions">
                        <button className="ac-btn-white" onClick={() => navigate('/t-bucks-transfer')}>
                          <TbTransfer />
                          <span className="transfer_label_id">Transfer</span>
                        </button>
                        <button className="ac-btn-white" onClick={() => navigate('/t-bucks-withdraw')}>
                          <PiBankBold />
                          <span className="withdraw_label_id">Withdraw</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Travel Dollars */}
                  <div className={`ac-wallet-slide${activeWallet === 2 ? ' active' : ''}`}>
                    <div className="ac-card-raised">
                      <p className="ac-balance-label balance_label_id">balance</p>
                      <div className="ac-balance-num">{parseFloat(walletData.t_dollars).toFixed(2)}</div>
                      <div className="ac-balance-currency travel_dollars_label_id">TRAVEL DOLLARS</div>
                      <div className="ac-wallet-actions">
                        <button className="ac-btn-white" onClick={() => {}}>
                          <MdOutlineRedeem />
                          <span className="redeem_label_id">Redeem</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="ac-sep" />

              {/* ── Finance summary ── */}
              <p className="ac-section-title">Earnings Overview</p>
              <div className="ac-fin-grid">

                <button className="ac-fin-card" onClick={() => navigate('/connects')}>
                  <div className="ac-fin-icon gold"><LuHandshake size={16} /></div>
                  <div className="ac-fin-label direct_bonus_label_id">Direct Bonus</div>
                  <div className="ac-fin-num">
                    <FaDollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                    {parseFloat(
                      parseFloat(getLegacyCommissionTotal.direct || 0) +
                      parseFloat(walletData.total_direct_commission || 0)
                    ).toFixed(2)}
                  </div>
                  <div className="ac-tag-green">+0.0%</div>
                </button>

                <button className="ac-fin-card" onClick={() => navigate('/commissions')}>
                  <div className="ac-fin-icon blue"><FaRegStar size={16} /></div>
                  <div className="ac-fin-label star_bonus_label_id">Stars Bonus</div>
                  <div className="ac-fin-num">
                    <FaDollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                    {parseFloat(
                      parseFloat(getLegacyCommissionTotal.market || 0) +
                      parseFloat(walletData.total_stars_commission || 0)
                    ).toFixed(2)}
                  </div>
                  <div className="ac-tag-red">-0.0%</div>
                </button>

                <button className="ac-fin-card">
                  <div className="ac-fin-icon green"><TbWorldDollar size={16} /></div>
                  <div className="ac-fin-label global_bonus_label_id">Global Bonus</div>
                  <div className="ac-fin-num">0.00</div>
                  <div className="ac-tag-muted">—</div>
                </button>

                <button className="ac-fin-card">
                  <div className="ac-fin-icon purple"><BsBarChartLine size={16} /></div>
                  <div className="ac-fin-label milestone_bonus_label_id">Milestone Bonus</div>
                  <div className="ac-fin-num">0.00</div>
                  <div className="ac-tag-muted">—</div>
                </button>

              </div>

              <div className="ac-sep" />

              {/* ── Quick actions ── */}
              <p className="ac-section-title">Quick Actions</p>
              <div className="ac-qa-grid">
                <button className="ac-qa-card" onClick={() => navigate('/connects')}>
                  <div className="ac-fin-icon gold" style={{ marginBottom: 8 }}><IconUsers /></div>
                  <div className="ac-qa-label">My Connects</div>
                  <div className="ac-qa-sub">View network</div>
                </button>
                <button className="ac-qa-card" onClick={() => navigate('/commissions')}>
                  <div className="ac-fin-icon blue" style={{ marginBottom: 8 }}><IconChart /></div>
                  <div className="ac-qa-label">Commissions</div>
                  <div className="ac-qa-sub">Earnings breakdown</div>
                </button>
                <button className="ac-qa-card" onClick={() => navigate('/subscriptions')}>
                  <div className="ac-fin-icon green" style={{ marginBottom: 8 }}><IconStar /></div>
                  <div className="ac-qa-label">Subscriptions</div>
                  <div className="ac-qa-sub">Upgrade plan</div>
                </button>
                <button className="ac-qa-card" onClick={handleShare}>
                  <div className="ac-fin-icon gold" style={{ marginBottom: 8 }}><IconLink /></div>
                  <div className="ac-qa-label">Referral Link</div>
                  <div className="ac-qa-sub">Share &amp; earn</div>
                </button>
              </div>
            </div>

            {/* ════════ RIGHT COLUMN ════════ */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p className="ac-section-title transaction_history_label_id" style={{ marginBottom: 0 }}>transaction history</p>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                  {getPaginationButtonNextPrev.total > 0 &&
                    `${getPaginationButtonNextPrev.from}–${getPaginationButtonNextPrev.to} of ${getPaginationButtonNextPrev.total}`
                  }
                </div>
              </div>

              <div className="ac-tx-filters">
                {['all', 'credit', 'debit'].map(t => (
                  <button
                    key={t}
                    className={`ac-tx-tab${activeTxTab === t ? ' active' : ''}`}
                    onClick={() => setActiveTxTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="ac-card">
                <div className="ac-tx-list">
                  {loadingContent ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : filteredTx.length === 0 ? (
                    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
                      No transactions found
                    </div>
                  ) : (
                    filteredTx.map((item, idx) => {
                      const isCredit   = item.is_credit;
                      const isDebit    = item.is_debit;
                      const showBucks  = parseInt(item.t_bucks)  !== 0;
                      const showPoints = parseInt(item.t_points) !== 0;
                      return (
                        <div
                          key={idx}
                          className="ac-tx-row"
                          style={{ opacity: requestLoading ? 0.4 : 1 }}
                        >
                          <div className="ac-tx-left">
                            <div className={`ac-tx-dot ${isCredit ? 'credit' : 'debit'}`} />
                            <div>
                              <div className="ac-tx-type">
                                {item.account_transaction_type === 'direct'
                                  ? item.account_transaction_type + ' commission'
                                  : item.account_transaction_type === 'star'
                                    ? item.account_transaction_type + ' commission'
                                    : item.account_transaction_type}
                              </div>
                              <div className="ac-tx-date">
                                {format(new Date(item.created_at), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </div>
                          <div className="ac-tx-right">
                            {showBucks && (
                              <div className={`ac-tx-amt ${isCredit ? 'plus' : 'minus'}`}>
                                <span>{isDebit ? '−' : '+'}</span>
                                <span>{parseFloat(item.t_bucks).toFixed(2)}</span>
                                {' '}
                                <span className="ac-tx-currency t_bucks_uppercase_label_id">T-BUCKS</span>
                              </div>
                            )}
                            {showPoints && (
                              <div
                                className={`ac-tx-amt ${isCredit ? 'plus' : 'minus'}`}
                                style={{ marginTop: showBucks ? 4 : 0 }}
                              >
                                <span>{isDebit ? '−' : '+'}</span>
                                <span>{parseFloat(item.t_points).toFixed(2)}</span>
                                {' '}
                                <span className="ac-tx-currency t_points_uppercase_label_id">T-POINTS</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="ac-tx-pagination">
                <button
                  className="ac-btn-ghost"
                  disabled={!getPaginationButtonNextPrev.prev_page_url}
                  onClick={() => setPaginate(getPaginationButtonNextPrev.prev_page_url)}
                  style={{ opacity: getPaginationButtonNextPrev.prev_page_url ? 1 : 0.35 }}
                >
                  <span className="previous_label_id">Previous</span>
                </button>
                <span style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'var(--text3)', alignSelf: 'center' }}>
                  {getPaginationButtonNextPrev.current_page && getPaginationButtonNextPrev.last_page
                    ? `Page ${getPaginationButtonNextPrev.current_page} / ${getPaginationButtonNextPrev.last_page}`
                    : ''}
                </span>
                <button
                  className="ac-btn-ghost"
                  disabled={!getPaginationButtonNextPrev.next_page_url}
                  onClick={() => setPaginate(getPaginationButtonNextPrev.next_page_url)}
                  style={{ opacity: getPaginationButtonNextPrev.next_page_url ? 1 : 0.35 }}
                >
                  <span className="next_label_id">Next</span>
                </button>
              </div>
            </div>
            {/* ════════ end RIGHT COLUMN ════════ */}

          </div>{/* end ac-main-grid */}
        </div>{/* end ac-wrap */}
      </div>{/* end ac-root */}

      {/* ── QR Share Modal (label_id compatible) ── */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" style={{ display: 'none' }} />
      <div className="modal" role="dialog" style={{ display: 'none' }}>
        <div className="modal-box">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 600, textTransform: 'uppercase' }}>
                {auth_states.StateUserInformation?.nick_names
                  ? auth_states.StateUserInformation.nick_names
                  : auth_states.StateUserInformation?.first_name}
              </p>
              <p style={{ fontSize: 15, fontWeight: 300 }}>
                {auth_states.StateUserInformation?.accounts_table?.account_number}
              </p>
            </div>
            <QRCode
              value={VITE_APP_PORTAL + 'login?sponsor=' + auth_states.StateUserInformation?.accounts_table?.account_number}
              size={150}
              viewBox="0 0 256 256"
            />
            <button onClick={() => handleShare(auth_states.payload)} style={{ padding: '8px 16px' }}>
              <span className="share_label_id">Share</span>
              <FaRegShareFromSquare size={18} style={{ marginLeft: 8 }} />
            </button>
          </div>
        </div>
        <label className="modal-backdrop close_label_id" htmlFor="my_modal_7">Close</label>
      </div>

      {/* ── Upgrade Subscription Modal ── */}
      {showUpgradeModal && (
        <div className="ac-modal-backdrop" onClick={() => setShowUpgradeModal(false)}>
          <div className="ac-modal" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="ac-modal-close" onClick={() => setShowUpgradeModal(false)}>✕</button>
            <div className="ac-upgrade-icon">
              <IconUpgrade />
            </div>
            <h2 className="ac-upgrade-title available_only_for_active_vip_members_label_id">
              available only for active VIP members.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <p className="ac-upgrade-sub earn_more_points_id" style={{ fontWeight: 600, marginBottom: 0 }}>
                Earn more points
              </p>
              <p className="ac-upgrade-sub members_could_save_id" style={{ marginBottom: 0 }}>
                Paid Memberships could save time and money finding great deals.
              </p>
            </div>
            <button
              className="ac-upgrade-btn upgrade_membership_label_id"
              onClick={() => { setShowUpgradeModal(false); navigate('/subscriptions'); }}
            >
              Upgrade Membership
            </button>
            <button
              className="ac-btn-ghost"
              style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
              onClick={() => setShowUpgradeModal(false)}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountContent;
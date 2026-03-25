import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Sparkles, MessageSquare, Users, Eye, ChevronRight, Pin, Flame,
  TrendingUp, Search, Bell, Plus, Shield, ToggleLeft, ToggleRight,
  Lock, Star, Hash, Grid, X, Bookmark, Share2, Flag, MoreHorizontal,
  ChevronUp, ChevronDown, Bold, Italic, Code, Quote, Link, Send,
  Edit3, Trash2, AlertCircle, ChevronLeft, FileText, CornerDownRight,
  Home, Loader2, RefreshCw, WifiOff,
} from 'lucide-react';

import * as forumApi from '../../services/forum/forum.index';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const TAGS             = ['Discussion', 'Question', 'Review', 'Hot', 'Announcement', 'WTS', 'WTB', 'Guide', 'Poll'];
const POSTS_PER_PAGE   = 10;
const THREADS_PER_PAGE = 15;

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════
const formatCount = n => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;

const timeAgo = iso => {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60)    return 'just now';
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};

const formatDate = iso =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const AVATAR_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];
const avatarColor = name => {
  let h = 0;
  for (const c of (name || 'U')) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
};

// ── Normalise a raw API post (snake_case → camelCase + fallbacks) ──────────
// Handles unlimited nesting depth via recursion.
const normalisePost = p => ({
  ...p,
  authorName: p.author      ?? p.authorName  ?? 'Unknown',
  authorId:   p.author_id   ?? p.authorId    ?? null,
  body:       p.body        ?? '',
  votes:      p.vote_count  ?? p.votes       ?? 0,
  userVote:   p.user_vote   ?? p.userVote    ?? null,
  createdAt:  p.created_at  ?? p.createdAt   ?? new Date().toISOString(),
  updatedAt:  p.updated_at  ?? p.updatedAt   ?? null,
  replies:    Array.isArray(p.replies) ? p.replies.map(r => normalisePost(r)) : [],
});

// ═══════════════════════════════════════════════════════════════
// SHARED UI ATOMS
// ═══════════════════════════════════════════════════════════════
const Avatar = ({ name = '?', size = 'md', className = '' }) => {
  const s = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' }[size];
  return (
    <div className={`${s} rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{ background: avatarColor(name) }}>
      {(name || '?').slice(0, 2).toUpperCase()}
    </div>
  );
};

const Spinner = ({ size = 'md', className = '' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return <Loader2 className={`${s} animate-spin text-primary ${className}`} />;
};

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <WifiOff className="w-10 h-10 mb-3 text-muted-foreground/40" />
    <p className="mb-1 font-semibold text-foreground">Failed to load</p>
    <p className="mb-4 text-sm text-muted-foreground">{message}</p>
    {onRetry && (
      <button onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-opacity rounded-lg bg-primary hover:opacity-90">
        <RefreshCw className="w-3.5 h-3.5" /> Try Again
      </button>
    )}
  </div>
);

// ── Toast ────────────────────────────────────────────────────────
const Toast = ({ toasts, remove }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id}
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium pointer-events-auto
        ${t.type === 'error'   ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                 'bg-background border-border text-foreground'}`}>
        {t.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
        {t.message}
        <button onClick={() => remove(t.id)} className="ml-1 opacity-60 hover:opacity-100">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    ))}
  </div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = 'info', ms = 4000) => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), ms);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, toast: add, removeToast: remove };
};

// ═══════════════════════════════════════════════════════════════
// RICH TEXT RENDERER
// Supports: **bold** *italic* `code` >quote @mention
// Consecutive "> " lines are grouped into a single styled blockquote.
// Deep/nested quote markers ("> > > ...") are collapsed to one level.
// ═══════════════════════════════════════════════════════════════
const parseLine = text => {
  const parts = []; let buf = ''; let i = 0;
  const flush = k => { if (buf) { parts.push(<span key={`t${k}`}>{buf}</span>); buf = ''; } };
  while (i < text.length) {
    if (text[i] === '*' && text[i + 1] === '*') {
      const e = text.indexOf('**', i + 2);
      if (e !== -1) { flush(i); parts.push(<strong key={i} className="font-semibold">{text.slice(i + 2, e)}</strong>); i = e + 2; continue; }
    }
    if (text[i] === '*') {
      const e = text.indexOf('*', i + 1);
      if (e !== -1) { flush(i); parts.push(<em key={i}>{text.slice(i + 1, e)}</em>); i = e + 1; continue; }
    }
    if (text[i] === '`') {
      const e = text.indexOf('`', i + 1);
      if (e !== -1) { flush(i); parts.push(<code key={i} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-primary">{text.slice(i + 1, e)}</code>); i = e + 1; continue; }
    }
    if (text[i] === '@') {
      const m = text.slice(i).match(/^@(\w+)/);
      if (m) { flush(i); parts.push(<span key={i} className="font-medium cursor-pointer text-primary hover:underline">{m[0]}</span>); i += m[0].length; continue; }
    }
    buf += text[i]; i++;
  }
  flush('end');
  return parts;
};

// Strip all leading "> " markers (handles "> > > " deep nesting from API)
const stripQuoteMarkers = line => line.replace(/^(>\s*)+/, '');

const RichBody = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const nodes = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];

    // ── Quote block: group all consecutive "> " lines ────────
    if (/^>\s?/.test(raw)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(stripQuoteMarkers(lines[i]));
        i++;
      }
      // Filter out empty quote lines that are just artefacts of deep nesting
      const meaningful = quoteLines.filter(l => l.trim() !== '');
      if (meaningful.length > 0) {
        nodes.push(
          <blockquote key={`q-${i}`}
            className="py-2 pl-3 my-2 space-y-1 border-l-4 rounded-r border-primary/40 bg-muted/25">
            {meaningful.map((ql, qi) => (
              <p key={qi} className="text-xs italic leading-relaxed text-muted-foreground">
                {parseLine(ql)}
              </p>
            ))}
          </blockquote>
        );
      }
      continue;
    }

    // ── List item ────────────────────────────────────────────
    if (raw.startsWith('- ')) {
      nodes.push(<li key={i} className="ml-5 text-sm list-disc text-foreground">{parseLine(raw.slice(2))}</li>);
      i++; continue;
    }

    // ── Empty line spacer ────────────────────────────────────
    if (raw.trim() === '') {
      nodes.push(<div key={i} className="h-2" />);
      i++; continue;
    }

    // ── Normal paragraph ─────────────────────────────────────
    nodes.push(<p key={i} className="text-sm leading-relaxed text-foreground">{parseLine(raw)}</p>);
    i++;
  }

  return <div className="space-y-1">{nodes}</div>;
};

// ═══════════════════════════════════════════════════════════════
// COMPOSER
// ═══════════════════════════════════════════════════════════════
const Composer = ({
  placeholder = 'Write your reply...',
  initialValue = '',
  onSubmit, onCancel,
  submitLabel = 'Post Reply',
  compact = false,
  quoteText = null,
  loading = false,
}) => {
  const [body, setBody]       = useState(
    quoteText
      ? `> ${quoteText.split('\n').join('\n> ')}\n\n`
      : (initialValue || '')
  );
  const [preview, setPreview] = useState(false);
  const ta = useRef();

  const wrap = (b, a = '', fb = 'text') => {
    const el = ta.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd, sel = body.slice(s, e);
    setBody(v => v.slice(0, s) + b + (sel || fb) + a + v.slice(e));
  };

  const submit = () => {
    if (!body.trim() || loading) return;
    onSubmit(body.trim());
    if (!onCancel) setBody('');
    setPreview(false);
  };

  const toolbar = [
    { icon: <Bold className="w-3.5 h-3.5" />,   action: () => wrap('**', '**') },
    { icon: <Italic className="w-3.5 h-3.5" />, action: () => wrap('*', '*') },
    { icon: <Code className="w-3.5 h-3.5" />,   action: () => wrap('`', '`', 'code') },
    { icon: <Quote className="w-3.5 h-3.5" />,  action: () => setBody(v => '> ' + v) },
    { icon: <Link className="w-3.5 h-3.5" />,   action: () => wrap('[', '](url)') },
  ];

  return (
    <div className={`border border-border rounded-xl overflow-hidden bg-background ${compact ? '' : 'shadow-sm'}`}>
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/20">
        {toolbar.map((t, i) => (
          <button key={i} onClick={t.action} disabled={loading}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            {t.icon}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setPreview(v => !v)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${preview ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview
        ? <div className="min-h-[90px] p-3">
          {body.trim()
            ? <RichBody text={body} />
            : <p className="text-sm italic text-muted-foreground">Nothing to preview.</p>}
        </div>
        : <textarea ref={ta} value={body} onChange={e => setBody(e.target.value)}
          placeholder={placeholder} disabled={loading}
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(); }}
          className="w-full p-3 text-sm bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
          style={{ minHeight: compact ? 90 : 160 }} />
      }

      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/10">
        <span className="text-[10px] text-muted-foreground hidden sm:block">**bold** *italic* `code` &gt;quote @mention • Ctrl+Enter</span>
        <div className="flex items-center gap-2 ml-auto">
          {onCancel && (
            <button onClick={onCancel} disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40">
              Cancel
            </button>
          )}
          <button onClick={submit} disabled={!body.trim() || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:opacity-90 disabled:opacity-40 transition-all">
            {loading ? <Spinner size="sm" /> : <Send className="w-3.5 h-3.5" />}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NEW THREAD MODAL
// ═══════════════════════════════════════════════════════════════
const NewThreadModal = ({ board, onClose, onSubmit, loading }) => {
  const [title, setTitle]     = useState('');
  const [body, setBody]       = useState('');
  const [tag, setTag]         = useState('');
  const [preview, setPreview] = useState(false);
  const [error, setError]     = useState('');
  const ta = useRef();

  const wrap = (b, a = '', fb = 'text') => {
    const el = ta.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd, sel = body.slice(s, e);
    setBody(v => v.slice(0, s) + b + (sel || fb) + a + v.slice(e));
  };

  const submit = () => {
    if (!title.trim())                           { setError('Please enter a title.'); return; }
    if (title.trim().length < 5)                 { setError('Title must be at least 5 characters.'); return; }
    if (!body.trim() || body.trim().length < 10) { setError('Content must be at least 10 characters.'); return; }
    onSubmit({ title: title.trim(), body: body.trim(), tag });
  };

  const toolbar = [
    { icon: <Bold className="w-3.5 h-3.5" />,   action: () => wrap('**', '**') },
    { icon: <Italic className="w-3.5 h-3.5" />, action: () => wrap('*', '*') },
    { icon: <Code className="w-3.5 h-3.5" />,   action: () => wrap('`', '`', 'code') },
    { icon: <Quote className="w-3.5 h-3.5" />,  action: () => setBody(v => '> ' + v) },
    { icon: <Link className="w-3.5 h-3.5" />,   action: () => wrap('[', '](url)') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl my-auto bg-white border shadow-2xl border-border rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-black text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>New Thread</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Posting in <span className="font-medium text-primary">{board.name}</span></p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Thread Title *</label>
            <input type="text" value={title} onChange={e => { setTitle(e.target.value); setError(''); }} disabled={loading}
              placeholder="Write a clear, descriptive title..."
              className="w-full px-3 py-2.5 bg-muted/30 border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-60" />
            <p className="text-[10px] text-muted-foreground mt-1">{title.length} / 255</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Tag</label>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map(t => (
                <button key={t} onClick={() => setTag(tag === t ? '' : t)} disabled={loading}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all disabled:opacity-60
                  ${tag === t ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold tracking-wider uppercase text-muted-foreground">Content *</label>
              <button onClick={() => setPreview(v => !v)} disabled={loading}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${preview ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
            <div className="overflow-hidden border border-border rounded-xl">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/20">
                {toolbar.map((t, i) => (
                  <button key={i} onClick={t.action} disabled={loading}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
                    {t.icon}
                  </button>
                ))}
              </div>
              {preview
                ? <div className="min-h-[160px] p-3">
                  {body.trim() ? <RichBody text={body} /> : <p className="text-sm italic text-muted-foreground">Nothing to preview.</p>}
                </div>
                : <textarea ref={ta} value={body} onChange={e => { setBody(e.target.value); setError(''); }} disabled={loading}
                  placeholder="Share your thoughts... Supports **bold**, *italic*, `code`, >quote"
                  className="w-full p-3 text-sm bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
                  style={{ minHeight: 160 }} />
              }
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">**bold** *italic* `code` &gt;quote @mention</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} disabled={loading}
            className="px-4 py-2 text-sm font-medium transition-colors rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-40">
            Cancel
          </button>
          <button onClick={submit} disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white transition-opacity rounded-xl bg-primary hover:opacity-90 disabled:opacity-60">
            {loading ? <Spinner size="sm" /> : <FileText className="w-4 h-4" />}
            {loading ? 'Posting...' : 'Post Thread'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// POST CARD
// ═══════════════════════════════════════════════════════════════
const PostCard = ({ post, isOP = false, depth = 0, onVote, onReply, onQuote, onEdit, onDelete, currentUser }) => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [editing, setEditing]         = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const isOwn   = post.authorId !== null && post.authorId === currentUser?.id;
  const menuRef = useRef();

  useEffect(() => {
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleEdit = async body => {
    setEditLoading(true);
    try { await onEdit(post.id, body); } finally { setEditLoading(false); setEditing(false); }
  };

  return (
    <div id={`post-${post.id}`}
      className={`flex gap-3 p-4 rounded-xl border transition-colors
      ${isOP
        ? 'bg-primary/5 border-primary/20'
        : depth > 0
          ? 'bg-muted/5 border-border/40 hover:border-border/70'
          : 'bg-muted/10 border-border/60 hover:border-border'}`}>

      {/* Vote / avatar column */}
      <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
        <Avatar name={post.authorName} size={depth > 0 ? 'sm' : 'lg'} />
        {!isOP && (
          <>
            <button onClick={() => onVote(post.id, 1)}
              className={`mt-2 p-1 rounded transition-colors ${post.userVote === 1 ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}>
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className={`text-xs font-bold min-w-[20px] text-center ${post.votes > 0 ? 'text-primary' : post.votes < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
              {post.votes}
            </span>
            <button onClick={() => onVote(post.id, -1)}
              className={`p-1 rounded transition-colors ${post.userVote === -1 ? 'text-red-400 bg-red-500/10' : 'text-muted-foreground hover:text-red-400 hover:bg-red-500/10'}`}>
              <ChevronDown className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-semibold text-sm ${isOwn ? 'text-primary' : 'text-foreground'}`}>{post.authorName}</span>
            {isOP  && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">OP</span>}
            {isOwn && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">You</span>}
            <span className="text-xs text-muted-foreground" title={formatDate(post.createdAt)}>{timeAgo(post.createdAt)}</span>
            {post.updatedAt && <span className="text-[10px] text-muted-foreground/50 italic">(edited)</span>}
          </div>
          {!isOP && (
            <div className="flex items-center gap-0.5">
              <button onClick={() => onQuote(post)} title="Quote"
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onReply(post)} title="Reply"
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <CornerDownRight className="w-3.5 h-3.5" />
              </button>
              <div ref={menuRef} className="relative">
                <button onClick={() => setMenuOpen(v => !v)}
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 z-20 bg-background border border-border rounded-xl shadow-xl min-w-[140px] py-1">
                    {isOwn && <>
                      <button onClick={() => { setEditing(true); setMenuOpen(false); }}
                        className="flex items-center w-full gap-2 px-3 py-2 text-xs transition-colors hover:bg-muted text-foreground">
                        <Edit3 className="w-3.5 h-3.5" />Edit Post
                      </button>
                      <button onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                        className="flex items-center w-full gap-2 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />Delete
                      </button>
                      <div className="my-1 border-t border-border" />
                    </>}
                    {/* <button onClick={() => { navigator.clipboard?.writeText(`${window.location.href}#post-${post.id}`); setMenuOpen(false); }}
                      className="flex items-center w-full gap-2 px-3 py-2 text-xs transition-colors hover:bg-muted text-muted-foreground">
                      <Share2 className="w-3.5 h-3.5" />Copy Link
                    </button> */}
                    {/* <button onClick={() => setMenuOpen(false)}
                      className="flex items-center w-full gap-2 px-3 py-2 text-xs transition-colors hover:bg-muted text-muted-foreground">
                      <Flag className="w-3.5 h-3.5" />Report
                    </button> */}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Body or edit composer */}
        {editing
          ? <Composer initialValue={post.body} onSubmit={handleEdit} onCancel={() => setEditing(false)} submitLabel="Save Edit" compact loading={editLoading} />
          : <RichBody text={post.body} />
        }
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// POST TREE — infinite depth, dynamic expand/collapse
// ═══════════════════════════════════════════════════════════════
const COLLAPSE_DEPTH = 0; // auto-collapse replies beyond this depth

const PostTree = ({
  post,
  depth = 0,
  onVote, onReply, onQuote, onEdit, onDelete,
  currentUser,
  collapsible = true,
}) => {
  const np = normalisePost(post);
  const hasReplies = np.replies.length > 0;

  // Auto-collapse deep threads; user can expand manually
  const [expanded, setExpanded] = useState(depth < COLLAPSE_DEPTH);

  // Indentation: levels 0-3 get progressively stronger borders,
  // level 4+ reuses the level-3 style (no further indent growth)
  const indentStyle = depth === 0 ? {} : {
    marginLeft: `${Math.min(depth, 3) * 16}px`,
    paddingLeft: '12px',
    borderLeft: `2px solid ${
      depth === 1 ? 'color-mix(in srgb, var(--color-primary, #6366f1) 30%, transparent)' :
      depth === 2 ? 'color-mix(in srgb, var(--color-primary, #6366f1) 18%, transparent)' :
                   'color-mix(in srgb, var(--color-border, #e4e4e7) 60%, transparent)'
    }`,
  };

  return (
    <div style={depth > 0 ? { ...indentStyle, marginTop: '8px' } : {}}>
      <PostCard
        post={np}
        isOP={false}
        depth={depth}
        onVote={onVote}
        onReply={onReply}
        onQuote={onQuote}
        onEdit={onEdit}
        onDelete={onDelete}
        currentUser={currentUser}
      />

      {hasReplies && (
        <>
          {/* Deep-thread collapse toggle */}
          {collapsible && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-2 ml-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <CornerDownRight className="w-3 h-3" />
              {np.replies.length} {np.replies.length === 1 ? 'reply' : 'replies'} — click to expand
            </button>
          )}

          {/* Collapse button when expanded at deep level */}
          {collapsible && expanded && depth >= COLLAPSE_DEPTH && (
            <button
              onClick={() => setExpanded(false)}
              className="mt-2 ml-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronUp className="w-3 h-3" />
              Collapse replies
            </button>
          )}

          {expanded && (
            <div className="space-y-2">
              {np.replies.map(reply => (
                <PostTree
                  key={reply.id}
                  post={reply}
                  depth={depth + 1}
                  onVote={onVote}
                  onReply={onReply}
                  onQuote={onQuote}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  currentUser={currentUser}
                  collapsible={collapsible}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// THREAD VIEW
// ═══════════════════════════════════════════════════════════════
const ThreadView = ({ thread, board, onBack, currentUser, token, toast }) => {
  const [posts, setPosts]               = useState([]);
  const [meta, setMeta]                 = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError]     = useState(null);
  const [sort, setSort]                 = useState('oldest');
  const [page, setPage]                 = useState(1);
  const [replyingTo, setReplyingTo]     = useState(null);
  const [quotingPost, setQuotingPost]   = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [localThread, setLocalThread]   = useState(thread);
  const composerRef = useRef();

  // ── Fetch posts ─────────────────────────────────────────────
  // API response shape (from JSON fixture):
  //   res.data = {
  //     success, thread,
  //     posts: { current_page, data: [...], last_page, total, ... },
  //     meta:  { current_page, last_page, total }
  //   }
  // Each item in posts.data has a `replies` array (already nested).
  const fetchPosts = useCallback(async (p = 1) => {
    setLoadingPosts(true);
    setPostsError(null);
    try {
      const res = await forumApi.getThread(token, localThread.slug ?? localThread.slug, {
        page: p, per_page: POSTS_PER_PAGE, sort,
      });

      const payload      = res.data ?? {};
      const postsPayload = payload.posts ?? {};

      // posts.data contains the flat top-level posts (each with nested replies)
      const rawPosts = postsPayload.data ?? [];

      // Prefer the top-level meta object; fall back to fields on postsPayload
      const topMeta = payload.meta ?? {};
      const mergedMeta = {
        current_page: topMeta.current_page ?? postsPayload.current_page ?? p,
        last_page:    topMeta.last_page    ?? postsPayload.last_page    ?? 1,
        total:        topMeta.total        ?? postsPayload.total        ?? rawPosts.length,
      };

      setPosts(rawPosts);
      setMeta(mergedMeta);

      // Refresh thread header data if the server returns it
      if (payload.thread) {
        setLocalThread(prev => ({ ...prev, ...payload.thread }));
      }
    } catch (e) {
      setPostsError(e.response?.data?.message ?? e.message ?? 'Unknown error');
    } finally {
      setLoadingPosts(false);
    }
  }, [token, localThread.slug, sort]);

  useEffect(() => { fetchPosts(page); }, [page, sort]);

  // ── Submit reply ────────────────────────────────────────────
  const submitReply = async body => {
    setReplyLoading(true);
    try {
      await forumApi.createPost(token, localThread.id, {
        body,
        parent_id: replyingTo?.id ?? null,
      });
      await fetchPosts(page);
      setLocalThread(t => ({ ...t, reply_count: (t.reply_count ?? 0) + 1 }));
      setReplyingTo(null);
      setQuotingPost(null);
      toast('Reply posted!', 'success');
    } catch (e) {
      toast(e.response?.data?.message ?? e.message, 'error');
    } finally {
      setReplyLoading(false);
    }
  };

  // ── Tree helpers ─────────────────────────────────────────────
  const findInTree = (list, id) => {
    for (const p of list) {
      if (p.id === id) return p;
      const found = findInTree(p.replies ?? [], id);
      if (found) return found;
    }
    return null;
  };

  const patchTree = (list, id, patcher) =>
    list.map(p => p.id === id
      ? patcher(p)
      : { ...p, replies: patchTree(p.replies ?? [], id, patcher) }
    );

  const removeFromTree = (list, id) =>
    list
      .filter(p => p.id !== id)
      .map(p => ({ ...p, replies: removeFromTree(p.replies ?? [], id) }));

  // ── Vote post (optimistic) ──────────────────────────────────
  const handleVotePost = async (postId, val) => {
    const prev = findInTree(posts, postId);
    if (!prev) return;
    const newVote = prev.user_vote === val ? null : val;
    const diff    = (newVote ?? 0) - (prev.user_vote ?? 0);
    setPosts(p => patchTree(p, postId, x => ({ ...x, user_vote: newVote, vote_count: (x.vote_count ?? 0) + diff })));
    try {
      const res = await forumApi.votePost(token, postId, val);
      setPosts(p => patchTree(p, postId, x => ({
        ...x,
        vote_count: res.data.vote_count ?? x.vote_count,
        user_vote:  res.data.user_vote  ?? x.user_vote,
      })));
    } catch (e) {
      setPosts(p => patchTree(p, postId, x => ({ ...x, user_vote: prev.user_vote, vote_count: (x.vote_count ?? 0) - diff })));
      toast(e.response?.data?.message ?? e.message, 'error');
    }
  };

  // ── Vote thread (optimistic) ────────────────────────────────
  const handleVoteThread = async val => {
    const snapshot = { ...localThread };
    const newVote  = (localThread.user_vote ?? null) === val ? null : val;
    const diff     = (newVote ?? 0) - (localThread.user_vote ?? 0);
    setLocalThread(t => ({ ...t, user_vote: newVote, vote_count: (t.vote_count ?? 0) + diff }));
    try {
      const res = await forumApi.voteThread(token, localThread.id, val);
      setLocalThread(t => ({ ...t, vote_count: res.data.vote_count, user_vote: res.data.user_vote }));
    } catch (e) {
      setLocalThread(snapshot);
      toast(e.response?.data?.message ?? e.message, 'error');
    }
  };

  // ── Bookmark (optimistic) ───────────────────────────────────
  const handleBookmark = async () => {
    const was = localThread.is_bookmarked ?? localThread.bookmarked ?? false;
    setLocalThread(t => ({ ...t, is_bookmarked: !was, bookmarked: !was }));
    try {
      await forumApi.bookmarkThread(token, localThread.id);
    } catch (e) {
      setLocalThread(t => ({ ...t, is_bookmarked: was, bookmarked: was }));
      toast(e.response?.data?.message ?? e.message, 'error');
    }
  };

  // ── Edit post ───────────────────────────────────────────────
  const handleEditPost = async (postId, body) => {
    try {
      const res = await forumApi.updatePost(token, postId, body);
      const newBody  = res.data.post?.body ?? body;
      const editedAt = res.data.post?.updated_at ?? new Date().toISOString();
      setPosts(p => patchTree(p, postId, x => ({ ...x, body: newBody, updated_at: editedAt })));
      toast('Post updated.', 'success');
    } catch (e) {
      toast(e.response?.data?.message ?? e.message, 'error');
      throw e;
    }
  };

  // ── Delete post ─────────────────────────────────────────────
  const handleDeletePost = async postId => {
    if (!window.confirm('Delete this post?')) return;
    const snapshot = [...posts];
    setPosts(p => removeFromTree(p, postId));
    setLocalThread(t => ({ ...t, reply_count: Math.max(0, (t.reply_count ?? 1) - 1) }));
    try {
      await forumApi.deletePost(token, postId);
      toast('Post deleted.', 'success');
    } catch (e) {
      setPosts(snapshot);
      setLocalThread(t => ({ ...t, reply_count: (t.reply_count ?? 0) + 1 }));
      toast(e.response?.data?.message ?? e.message, 'error');
    }
  };

  const doReply = post => {
    const np = normalisePost(post);
    setReplyingTo(np); setQuotingPost(null);
    setTimeout(() => composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };
  const doQuote = post => {
    const np = normalisePost(post);
    setQuotingPost(np); setReplyingTo(np);
    setTimeout(() => composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  // ── OP post shape ────────────────────────────────────────────
  const opPost = normalisePost({
    id:         `op-${localThread.id}`,
    author:     localThread.author    ?? localThread.authorName ?? 'Unknown',
    author_id:  localThread.author_id ?? localThread.authorId   ?? null,
    body:       localThread.body      ?? '',
    vote_count: localThread.vote_count ?? localThread.votes     ?? 0,
    user_vote:  localThread.user_vote  ?? localThread.userVote  ?? null,
    created_at: localThread.created_at ?? localThread.createdAt,
    updated_at: null,
    replies:    [],
  });

  const isBookmarked = localThread.is_bookmarked ?? localThread.bookmarked ?? false;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <button onClick={() => onBack('home')} className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home className="w-3 h-3" />Forums
        </button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => onBack('board')} className="transition-colors hover:text-primary">{board.name}</button>
        <ChevronRight className="w-3 h-3" />
        <span className="font-medium truncate text-foreground max-w-[180px]">{localThread.title}</span>
      </nav>

      {/* Thread header */}
      <div className="p-5 border bg-background border-border rounded-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {localThread.is_pinned && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Pin className="w-2.5 h-2.5" />Pinned</span>}
              {localThread.is_locked && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border"><Lock className="w-2.5 h-2.5" />Locked</span>}
              {localThread.is_hot    && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20"><Flame className="w-2.5 h-2.5" />Hot</span>}
              {localThread.tag       && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">{localThread.tag}</span>}
            </div>
            <h1 className="text-xl font-black leading-tight text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>{localThread.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>by <span className="font-medium text-primary">{localThread.author ?? localThread.authorName}</span></span>
              <span title={formatDate(localThread.created_at ?? localThread.createdAt)}>{timeAgo(localThread.created_at ?? localThread.createdAt)}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatCount(localThread.view_count ?? 0)}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{meta.total} replies</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center overflow-hidden border rounded-lg border-border">
              <button onClick={() => handleVoteThread(1)}
                className={`p-2 transition-colors ${localThread.user_vote === 1 ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-primary'}`}>
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className={`px-2 text-sm font-bold ${localThread.user_vote === 1 ? 'text-primary' : localThread.user_vote === -1 ? 'text-red-400' : 'text-foreground'}`}>
                {localThread.vote_count ?? 0}
              </span>
              <button onClick={() => handleVoteThread(-1)}
                className={`p-2 transition-colors ${localThread.user_vote === -1 ? 'bg-red-500 text-white' : 'hover:bg-muted text-muted-foreground hover:text-red-400'}`}>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            {/* <button onClick={handleBookmark}
              className={`p-2 rounded-lg border transition-colors ${isBookmarked ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted text-muted-foreground'}`}>
              <Bookmark className="w-4 h-4" />
            </button> */}
            {/* <button onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="p-2 transition-colors border rounded-lg border-border hover:bg-muted text-muted-foreground">
              <Share2 className="w-4 h-4" />
            </button> */}
          </div>
        </div>
      </div>

      {/* OP post */}
      <PostCard
        post={opPost}
        isOP
        depth={0}
        onVote={() => {}}
        onReply={doReply}
        onQuote={doQuote}
        onEdit={() => {}}
        onDelete={() => {}}
        currentUser={currentUser}
      />

      {/* Sort + refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-muted-foreground">Sort:</span>
          {[['oldest', 'Oldest'], ['newest', 'Newest'], ['top', 'Top']].map(([v, l]) => (
            <button key={v} onClick={() => { setSort(v); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${sort === v ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{meta.total} {meta.total === 1 ? 'reply' : 'replies'}</span>
          <button onClick={() => fetchPosts(page)}
            className="flex items-center gap-1 text-xs transition-colors text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-3 h-3" />Refresh
          </button>
        </div>
      </div>

      {/* Posts list */}
      {loadingPosts
        ? <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        : postsError
          ? <ErrorState message={postsError} onRetry={() => fetchPosts(page)} />
          : posts.length > 0
            ? (
              <div className="space-y-3">
                {posts.map(p => (
                  <PostTree
                    key={p.id}
                    post={p}
                    depth={0}
                    onVote={handleVotePost}
                    onReply={doReply}
                    onQuote={doQuote}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )
            : (
              <div className="py-12 text-center border border-border rounded-xl bg-background">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30 text-muted-foreground" />
                <p className="font-semibold text-foreground">No replies yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Be the first to reply!</p>
              </div>
            )
      }

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === p ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reply composer */}
      <div ref={composerRef} className="overflow-hidden border rounded-xl border-border bg-background">
        {localThread.is_locked
          ? <div className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 shrink-0" />Thread is locked. No new replies can be posted.
          </div>
          : <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20">
              <Avatar name={currentUser?.first_name || 'You'} size="md" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {replyingTo
                    ? <span>Replying to <span className="text-primary">{replyingTo.authorName}</span></span>
                    : 'Post a Reply'}
                </p>
                {replyingTo && (
                  <button onClick={() => { setReplyingTo(null); setQuotingPost(null); }}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    × Clear
                  </button>
                )}
              </div>
            </div>
            <div className="p-3">
              <Composer
                key={`${replyingTo?.id}-${quotingPost?.id}`}
                placeholder={replyingTo ? `Replying to ${replyingTo.authorName}...` : 'Share your thoughts...'}
                quoteText={
                  quotingPost
                    ? `${quotingPost.authorName} wrote:\n${(quotingPost.body ?? '').slice(0, 200)}${(quotingPost.body ?? '').length > 200 ? '...' : ''}`
                    : null
                }
                onSubmit={submitReply}
                onCancel={replyingTo ? () => { setReplyingTo(null); setQuotingPost(null); } : null}
                loading={replyLoading}
                compact
              />
            </div>
          </>
        }
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BOARD VIEW
// ═══════════════════════════════════════════════════════════════
const BoardView = ({ board, onBack, onSelectThread, onNewThread, token }) => {
  const [threads, setThreads] = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [sort, setSort]       = useState('latest');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const debounceRef = useRef();

  const fetchThreads = useCallback(async (p = 1, s = sort, q = search) => {
    setLoading(true); setError(null);
    try {
      const res = await forumApi.getBoard(token, board.slug, { page: p, per_page: THREADS_PER_PAGE, sort: s, search: q || undefined });
      setThreads(res.data.threads?.data ?? []);
      setMeta(res.data.threads?.meta ?? { current_page: p, last_page: 1, total: 0 });
    } catch (e) {
      setError(e.response?.data?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  }, [token, board.slug, sort, search]);

  useEffect(() => { fetchThreads(page, sort, search); }, [page, sort]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(1); fetchThreads(1, sort, search); }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <button onClick={onBack} className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home className="w-3 h-3" />Forums
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="font-medium text-foreground">{board.name}</span>
      </nav>

      <div className="p-5 border bg-background border-border rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>{board.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{board.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{formatCount(board.thread_count ?? 0)} threads</span>
              <span>{formatCount(board.post_count ?? 0)} posts</span>
            </div>
          </div>
          {!board.is_locked && (
            <button onClick={onNewThread} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity shrink-0">
              <Plus className="w-4 h-4" />New Thread
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..."
            className="w-full py-2 pl-8 pr-3 text-xs transition-all border rounded-lg bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex items-center gap-1">
          {[['latest', 'Latest'], ['hot', 'Hot'], ['top', 'Top Voted']].map(([v, l]) => (
            <button key={v} onClick={() => { setSort(v); setPage(1); }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === v ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
              {l}
            </button>
          ))}
        </div>
        <button onClick={() => fetchThreads(page, sort, search)} title="Refresh"
          className="p-2 transition-colors rounded-lg hover:bg-muted text-muted-foreground">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-hidden border rounded-xl border-border bg-background">
        <div className="hidden md:grid grid-cols-[1fr_64px_64px_64px] gap-2 px-4 py-2.5 border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Thread</span><span className="text-center">Votes</span><span className="text-center">Replies</span><span className="text-center">Views</span>
        </div>
        {loading
          ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          : error
            ? <ErrorState message={error} onRetry={() => fetchThreads(page, sort, search)} />
            : threads.length > 0
              ? <div className="divide-y divide-border">
                {threads.map(t => (
                  <div key={t.id} onClick={() => onSelectThread(t)}
                    className="md:grid md:grid-cols-[1fr_64px_64px_64px] flex flex-col gap-2 px-4 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer group items-center">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {t.is_pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                        {t.is_locked && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
                        {t.is_hot    && <Flame className="w-3 h-3 text-orange-400 shrink-0" />}
                        {t.tag       && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">{t.tag}</span>}
                        <span className="text-sm font-semibold transition-colors text-foreground group-hover:text-primary line-clamp-1">{t.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        by <span className="text-primary/80">{t.author}</span> · <span title={formatDate(t.created_at)}>{timeAgo(t.created_at)}</span>
                      </p>
                    </div>
                    <div className={`hidden md:flex items-center justify-center text-sm font-bold ${(t.vote_count ?? 0) > 0 ? 'text-primary' : 'text-muted-foreground'}`}>{formatCount(t.vote_count ?? 0)}</div>
                    <div className="items-center justify-center hidden text-sm font-semibold md:flex text-foreground">{formatCount(t.reply_count ?? 0)}</div>
                    <div className="items-center justify-center hidden text-xs md:flex text-muted-foreground">{formatCount(t.view_count ?? 0)}</div>
                    <div className="flex items-center gap-3 text-xs md:hidden text-muted-foreground">
                      <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3" />{formatCount(t.vote_count ?? 0)}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{formatCount(t.reply_count ?? 0)}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatCount(t.view_count ?? 0)}</span>
                    </div>
                  </div>
                ))}
              </div>
              : <div className="py-16 text-center text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">{search ? 'No threads match your search' : 'No threads yet'}</p>
                {!search && !board.is_locked && <button onClick={onNewThread} className="mt-3 text-sm text-primary hover:underline">Post the first thread →</button>}
              </div>
        }
      </div>

      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === p ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HOME VIEW
// ═══════════════════════════════════════════════════════════════
const HomeView = ({ searchQuery, onSelectBoard, token }) => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchHome = async () => {
    setLoading(true); setError(null);
    try {
      const [catRes, statsRes] = await Promise.all([
        forumApi.getCategories(token),
        forumApi.getForumStats(token),
      ]);
      setCategories(catRes.data.categories ?? []);
      setStats(statsRes.data.stats ?? null);
    } catch (e) {
      setError(e.response?.data?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHome(); }, []);

  const filtered = searchQuery
    ? categories
      .map(c => ({ ...c, boards: (c.boards ?? []).filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.description?.toLowerCase().includes(searchQuery.toLowerCase())) }))
      .filter(c => c.boards?.length > 0)
    : categories;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (error)   return <ErrorState message={error} onRetry={fetchHome} />;

  return (
    <>
      {/* {stats && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-3 lg:grid-cols-6">
            {[
              { label: 'Threads',    val: formatCount(stats.total_threads    ?? 0), icon: <FileText className="w-4 h-4" /> },
              { label: 'Posts',      val: formatCount(stats.total_posts      ?? 0), icon: <MessageSquare className="w-4 h-4" /> },
              { label: 'Members',    val: formatCount(stats.total_members    ?? 0), icon: <Users className="w-4 h-4" /> },
              { label: 'Boards',     val: formatCount(stats.total_boards     ?? 0), icon: <Grid className="w-4 h-4" /> },
              { label: 'Categories', val: formatCount(stats.total_categories ?? 0), icon: <Hash className="w-4 h-4" /> },
              { label: 'Online',     val: formatCount((stats.online_members ?? 0) + (stats.online_guests ?? 0)),
                icon: <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> },
            ].map(({ label, val, icon }) => (
              <div key={label} className="bg-background border border-border rounded-xl px-3 py-3 flex items-center gap-2.5">
                <span className="text-muted-foreground shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-base font-black leading-none truncate text-foreground">{val}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-2 mb-5 text-xs border rounded-lg bg-muted/20 border-border text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Record online: <strong className="ml-1 text-foreground">{formatCount(stats.record_online ?? 0)}</strong>
            </span>
            {stats.newest_member && (
              <span className="flex items-center gap-1.5">
                Newest member: <strong className="ml-1 text-primary">{stats.newest_member}</strong>
              </span>
            )}
          </div>
        </>
      )} */}

      {filtered.length > 0
        ? filtered.map(cat => (
          <div key={cat.id} className="mb-5 overflow-hidden border rounded-xl border-border bg-background">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border" style={{ background: `${cat.color || '#6366f1'}12` }}>
              <span className="text-xl">{cat.icon}</span>
              <div>
                <h2 className="text-sm font-black text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>{cat.name}</h2>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {(cat.boards || []).map(board => (
                <div key={board.id} onClick={() => onSelectBoard(board)}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-center transition-colors border rounded-lg shrink-0 w-9 h-9 border-border bg-muted/40 group-hover:border-primary/40">
                    <MessageSquare className="w-4 h-4 transition-colors text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold transition-colors text-foreground group-hover:text-primary">{board.name}</span>
                      {board.is_pinned && <Pin className="w-3 h-3 text-amber-400" />}
                      {board.is_locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <p className="text-xs truncate text-muted-foreground">{board.description}</p>
                  </div>
                  <div className="items-center hidden gap-5 text-xs md:flex text-muted-foreground shrink-0">
                    <div className="text-center"><p className="font-semibold text-foreground">{formatCount(board.thread_count ?? 0)}</p><p>Threads</p></div>
                    <div className="text-center"><p className="font-semibold text-foreground">{formatCount(board.post_count ?? 0)}</p><p>Posts</p></div>
                  </div>
                  {board.last_post && (
                    <div className="hidden lg:block text-xs text-right shrink-0 max-w-[160px]">
                      <p className="font-medium truncate text-foreground">{board.last_post.title}</p>
                      <p className="text-muted-foreground">by <span className="text-primary">{board.last_post.author}</span> · {timeAgo(board.last_post.created_at)}</p>
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))
        : <div className="py-16 text-center text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No boards match your search</p>
        </div>
      }
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRENDING SIDEBAR
// ═══════════════════════════════════════════════════════════════
const TrendingSidebar = ({ onSelectThread, token }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    forumApi.getTrending(token, 7, 6)
      .then(r => setThreads(r.data.threads ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <aside className="space-y-4">
      <div className="overflow-hidden border rounded-xl border-border bg-background">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>Trending</span>
        </div>
        {loading
          ? <div className="flex justify-center py-8"><Spinner size="sm" /></div>
          : threads.length === 0
            ? <p className="px-4 py-6 text-xs text-center text-muted-foreground">No trending threads yet</p>
            : <div className="divide-y divide-border">
              {threads.map((t, i) => (
                <div key={t.id} onClick={() => onSelectThread(t)} className="px-4 py-3 transition-colors cursor-pointer hover:bg-muted/20 group">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-black text-muted-foreground/40 mt-0.5 w-4 shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        {t.is_hot    && <Flame className="w-3 h-3 text-orange-400 shrink-0" />}
                        {t.is_pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                        {t.tag       && <span className="text-[10px] text-primary font-semibold">{t.tag}</span>}
                      </div>
                      <p className="text-xs font-medium leading-snug transition-colors text-foreground group-hover:text-primary line-clamp-2">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        by <span className="text-primary/80">{t.author}</span>
                        {t.board && <span> · {t.board}</span>}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><ChevronUp className="w-2.5 h-2.5" />{formatCount(t.vote_count ?? 0)}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" />{t.reply_count ?? 0}</span>
                        <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{formatCount(t.view_count ?? 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      {/* <div className="overflow-hidden border rounded-xl border-border bg-background">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>Quick Links</span>
        </div>
        <div className="p-2 space-y-0.5">
          {['Forum Rules', 'FAQ', 'Report a Bug', 'Suggest a Feature', 'Contact Staff'].map(l => (
            <button key={l} className="flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground group">
              {l}<ChevronRight className="w-3 h-3 transition-opacity opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div> */}
    </aside>
  );
};

// ═══════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
const AdminPanel = ({ forumEnabled, onClose, token, toast }) => {
  const [enabled, setEnabled] = useState(forumEnabled);
  const [saving, setSaving]   = useState(false);

  const toggle = async () => {
    setSaving(true);
    try {
      const res = await forumApi.toggleForum(token, !enabled);
      setEnabled(res.data.forum_enabled);
      toast(res.data.message, 'success');
    } catch (e) {
      toast(e.response?.data?.message ?? e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 overflow-hidden bg-white border shadow-2xl border-border rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>Admin Panel</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between p-4 border rounded-xl border-border bg-muted/20">
            <div>
              <p className="font-semibold text-foreground">Forum Feature</p>
              <p className="text-sm text-muted-foreground mt-0.5">{enabled ? 'Forum is live' : 'Showing Coming Soon page'}</p>
            </div>
            <button onClick={toggle} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-full disabled:opacity-60"
              style={{ background: enabled ? 'var(--color-primary,#6366f1)' : '#3f3f46', color: '#fff' }}>
              {saving ? <Spinner size="sm" /> : enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {saving ? 'Saving...' : enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg text-sm border ${enabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${enabled ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {enabled ? 'All boards and threads are accessible.' : 'Forum is hidden — users see Coming Soon.'}
          </div>
          <p className="text-xs text-muted-foreground">Changes take effect immediately via API.</p>
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:opacity-90 transition-opacity">Done</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMING SOON
// ═══════════════════════════════════════════════════════════════
const ComingSoonPage = ({ onAdminOpen }) => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-primary animate-pulse" />
        </div>
        <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground">
          <span className="text-transparent bg-gradient-to-r from-primary via-primary to-accent bg-clip-text coming_label_id">Coming</span>
          <br /><span className="text-foreground soon_label_id">Soon</span>
        </h1>
      </div>
      <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2">
        <p className="text-sm text-center text-muted-foreground coming_soon_all_rights_reserved">© 2024 Coming Soon. All rights reserved.</p>
      </div>
    </div>
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-2 h-2 rounded-full top-1/4 left-1/4 bg-primary/30 animate-bounce" />
      <div className="absolute w-1 h-1 delay-1000 rounded-full top-1/3 right-1/3 bg-primary/40 animate-bounce" />
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce delay-2000" />
    </div>
    <button onClick={onAdminOpen} className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-muted/60 border border-border hover:bg-muted transition-colors" title="Admin">
      <Shield className="w-4 h-4 text-muted-foreground" />
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// FORUM PAGE
// ═══════════════════════════════════════════════════════════════
const ForumPage = ({ onAdminOpen, token, toast }) => {
  const auth_states = useSelector(state => state.AuthReducer);
  const currentUser = auth_states?.StateUserInformation ?? { id: null, first_name: 'Guest', role: 'guest' };

  const [view, setView]                         = useState('home');
  const [selectedBoard, setSelectedBoard]       = useState(null);
  const [selectedThread, setSelectedThread]     = useState(null);
  const [searchQuery, setSearchQuery]           = useState('');
  const [showNewThread, setShowNewThread]       = useState(false);
  const [newThreadLoading, setNewThreadLoading] = useState(false);
  const [getLoadingSelect, setGetLoadingSelect] = useState(false);

  // ── Heartbeat ───────────────────────────────────────────────
  useEffect(() => {
    const ping = () => forumApi.sendHeartbeat(token).catch(() => {});
    ping();
    const interval = setInterval(ping, 60_000);
    return () => clearInterval(interval);
  }, [token]);

  const selectBoard  = b => { setSelectedBoard(b); setView('board'); setSearchQuery(''); };
  const selectThread = t => { setSelectedThread(t); setView('thread'); };
  const goBack = target => {
    if (target === 'home')  { setView('home');  setSelectedBoard(null); setSelectedThread(null); }
    if (target === 'board') { setView('board'); setSelectedThread(null); }
  };

  const createThread = async ({ title, body, tag }) => {
    setNewThreadLoading(true);
    try {
      const res = await forumApi.createThread(token, {
        forum_board_id: selectedBoard.id,
        title, body,
        tag: tag || undefined,
      });
      toast('Thread posted!', 'success');
      setShowNewThread(false);
      setSelectedThread(res.data.thread);
      setView('thread');
    } catch (e) {
      toast(e.response?.data?.message ?? e.message, 'error');
    } finally {
      setNewThreadLoading(false);
    }
  };

  const selectTrendingThread = async t => {
    try {
      setGetLoadingSelect(true);

      const res = await forumApi.getThread(token, t.slug);
      const board = {
        id:   res.data.thread?.forum_board_id,
        name: res.data.thread?.board,
        slug: res.data.thread?.board_slug,
      };
      setSelectedBoard(board);
      setSelectedThread(res.data.thread);
      setGetLoadingSelect(false);

      setView('thread');
    } catch (e) {
      toast(e.response?.data?.message ?? e.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex items-center gap-3 h-14">
            <button onClick={() => goBack('home')} className="flex items-center gap-2 transition-opacity shrink-0 hover:opacity-80">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'var(--color-primary,#6366f1)' }}>
                <Hash className="w-4 h-4 text-white" />
              </div>
              <span className="hidden text-lg font-black text-foreground sm:block" style={{ fontFamily: "'Sora',sans-serif", letterSpacing: '-0.03em' }}>ClubTEN Social Forum</span>
            </button>
            {/* <div className="flex-1 max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search forums..."
                  className="w-full py-2 pr-4 text-sm transition-all border rounded-full pl-9 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div> */}
            <div className="flex items-center gap-1.5 shrink-0 ">
              {view === 'board' && selectedBoard && !selectedBoard.is_locked && (
                <button onClick={() => setShowNewThread(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-white hover:opacity-90 transition-opacity">
                  <Plus className="w-3.5 h-3.5" />New Thread
                </button>
              )}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-border bg-muted/20">
                <Avatar name={currentUser?.first_name || '?'} size="sm" />
                <span className="hidden text-xs font-medium text-foreground sm:block">{currentUser?.first_name || 'Guest'}</span>
              </div>
              {/* <button className="relative p-2 transition-colors rounded-lg hover:bg-muted">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1" />
              </button> */}
              
              {
                auth_states?.StateUserInformation?.accounts_table.user_type_table.user_type_is_admin &&
                <button onClick={onAdminOpen} className="p-2 transition-colors rounded-lg hover:bg-muted" title="Admin">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </button>
              }
            </div>
          </div>
        </div>
      </header>

      {showNewThread && selectedBoard && (
        <NewThreadModal board={selectedBoard} onClose={() => setShowNewThread(false)} onSubmit={createThread} loading={newThreadLoading} />
      )}
      {
        
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6">
            <div className="flex gap-6">
              <main className="flex-1 min-w-0">
                {view === 'home' && (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "'Sora',sans-serif", letterSpacing: '-0.03em' }}>Community Forums</h1>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Grid className="w-3.5 h-3.5" />
                        <span>Forum</span>
                      </div>
                    </div>
                    <HomeView searchQuery={searchQuery} onSelectBoard={selectBoard} token={token} />
                  </>
                )}
                {view === 'board' && selectedBoard && (
                  <BoardView
                    board={selectedBoard}
                    onBack={() => goBack('home')}
                    onSelectThread={selectThread}
                    onNewThread={() => setShowNewThread(true)}
                    token={token}
                  />
                )}
                {view === 'thread' && selectedThread && selectedBoard && (
                  getLoadingSelect 
                  ? 
                    <div className="flex items-center justify-center min-h-screen bg-background"><Spinner size="lg" /></div>
                  :
                  <ThreadView
                    thread={selectedThread}
                    board={selectedBoard}
                    onBack={goBack}
                    currentUser={currentUser}
                    token={token}
                    toast={toast}
                  />
                )}
              </main>
              <div className="hidden w-64 xl:block shrink-0">
                <TrendingSidebar onSelectThread={selectTrendingThread} token={token} />
              </div>
            </div>
          </div>
      }
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ROOT — MallSocial
// ═══════════════════════════════════════════════════════════════
const MallSocial = () => {
  const auth_states = useSelector(state => state.AuthReducer);
  const token = auth_states.StateToken;

  const [forumEnabled, setForumEnabled]   = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [adminOpen, setAdminOpen]         = useState(false);
  const { toasts, toast, removeToast }    = useToast();

  useEffect(() => {
    forumApi.getForumStatus()
      .then(res => setForumEnabled(res.data.forum_enabled ?? false))
      .catch(() => {})
      .finally(() => setStatusLoading(false));
  }, []);

  useEffect(() => {
    auth_states.PageLanguages?.map(item => {
      const translation = item.translation;
      if (translation.length > 0 && auth_states.SelectedLanguage) {
        const filteredTranslation = translation.find(t => t.language_id == auth_states.SelectedLanguage.id);
        const targetElement = document.getElementsByClassName(item.page_config_id);
        if (targetElement?.length > 0) {
          Array.from(targetElement).forEach(el => {
            el.textContent = filteredTranslation ? filteredTranslation.page_config_title : item.page_config_title;
          });
        }
      }
    });
  }, [auth_states]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;900&display=swap');
        .line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}
        .line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
      `}</style>

      <Toast toasts={toasts} remove={removeToast} />

      {adminOpen && (
        <AdminPanel
          forumEnabled={forumEnabled}
          onClose={() => setAdminOpen(false)}
          token={token}
          toast={toast}
        />
      )}

      {statusLoading
        ? <div className="flex items-center justify-center min-h-screen bg-background"><Spinner size="lg" /></div>
        : forumEnabled
          ? <ForumPage onAdminOpen={() => setAdminOpen(true)} token={token} toast={toast} />
          : <div className="flex items-center justify-center min-h-screen bg-background"><Spinner size="lg" /></div>
          // <ComingSoonPage onAdminOpen={() => setAdminOpen(true)} />
      }
    </>
  );
};

export default MallSocial;
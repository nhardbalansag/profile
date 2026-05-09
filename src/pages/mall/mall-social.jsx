import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Sparkles, MessageSquare, Users, Eye, ChevronRight, Pin, Flame,
  TrendingUp, Search, Bell, Plus, Shield, ToggleLeft, ToggleRight,
  Lock, Star, Hash, Grid, X, Bookmark, Share2, Flag, MoreHorizontal,
  ChevronUp, ChevronDown, Bold, Italic, Code, Quote, Link, Send,
  Edit3, Trash2, AlertCircle, ChevronLeft, FileText, CornerDownRight,
  Home, Loader2, RefreshCw, WifiOff, ArrowLeft, Pen, MessageCircle,
  Check, Image, Video, Upload,
} from 'lucide-react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { LuCircleDollarSign } from "react-icons/lu";
import { IoFitnessOutline } from "react-icons/io5";
import { PiPottedPlantBold } from "react-icons/pi";
import { BiStore } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";

import { Link as LinkDom } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import { Header, Footer, LanguageBottomSheet } from "../../component/index";

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
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const AVATAR_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];
const avatarColor = name => {
  let h = 0;
  for (const c of (name || 'U')) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
};

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

const isHTMLContent = text => /<[a-z][\s\S]*>/i.test(text ?? '');
const isQuillEmpty = html => !html || html === '<p><br></p>' || html.trim() === '';

// ═══════════════════════════════════════════════════════════════
// SHARED UI ATOMS
// ═══════════════════════════════════════════════════════════════
const Avatar = ({ name = '?', size = 'md', className = '' }) => {
  const s = { xs: 'w-5 h-5 text-[9px]', sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-9 h-9 text-sm' }[size];
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
  <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
    <WifiOff className="w-10 h-10 mb-3 text-muted-foreground/40" />
    <p className="mb-1 font-semibold text-foreground">Failed to load</p>
    {onRetry && (
      <button onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-primary hover:opacity-90 active:scale-95 transition-all">
        <RefreshCw className="w-3.5 h-3.5" /> Try Again
      </button>
    )}
  </div>
);

// ── Toast ─────────────────────────────────────────────────────
const Toast = ({ toasts, remove }) => (
  <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[calc(100vw-2rem)] sm:w-auto max-w-sm">
    {toasts.map(t => (
      <div key={t.id}
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium pointer-events-auto
        ${t.type === 'error'   ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                 'bg-background border-border text-foreground'}`}>
        {t.type === 'error'   && <AlertCircle className="w-4 h-4 shrink-0" />}
        {t.type === 'success' && <Check className="w-4 h-4 shrink-0" />}
        <span className="flex-1">{t.message}</span>
        <button onClick={() => remove(t.id)} className="ml-1 opacity-60 hover:opacity-100 p-0.5"><X className="w-3.5 h-3.5" /></button>
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

// ── Bottom Sheet ──────────────────────────────────────────────
const BottomSheet = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full overflow-hidden bg-white border shadow-2xl sm:max-w-md rounded-t-3xl sm:rounded-2xl border-border forum-slide-up">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <span className="text-base font-bold text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>{title}</span>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors"><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        )}
        <div className="max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// RICH CONTENT RENDERER
// ═══════════════════════════════════════════════════════════════
const parseLine = text => {
  const parts = []; let buf = ''; let i = 0;
  const flush = k => { if (buf) { parts.push(<span key={`t${k}`}>{buf}</span>); buf = ''; } };
  while (i < text.length) {
    if (text[i] === '*' && text[i+1] === '*') { const e=text.indexOf('**',i+2); if(e!==-1){flush(i);parts.push(<strong key={i} className="font-semibold">{text.slice(i+2,e)}</strong>);i=e+2;continue;} }
    if (text[i] === '*') { const e=text.indexOf('*',i+1); if(e!==-1){flush(i);parts.push(<em key={i}>{text.slice(i+1,e)}</em>);i=e+1;continue;} }
    if (text[i] === '`') { const e=text.indexOf('`',i+1); if(e!==-1){flush(i);parts.push(<code key={i} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-primary">{text.slice(i+1,e)}</code>);i=e+1;continue;} }
    if (text[i] === '@') { const m=text.slice(i).match(/^@(\w+)/); if(m){flush(i);parts.push(<span key={i} className="font-medium cursor-pointer text-primary hover:underline">{m[0]}</span>);i+=m[0].length;continue;} }
    buf+=text[i]; i++;
  }
  flush('end'); return parts;
};

const MarkdownBody = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n'); const nodes = []; let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    if (/^>\s?/.test(raw)) {
      const ql = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { ql.push(lines[i].replace(/^(>\s*)+/,'')); i++; }
      const m = ql.filter(l=>l.trim()!=='');
      if (m.length > 0) nodes.push(<blockquote key={`q${i}`} className="py-2 pl-3 my-1.5 border-l-4 rounded-r border-primary/40 bg-muted/25">{m.map((l,qi)=><p key={qi} className="text-xs italic leading-relaxed text-muted-foreground">{parseLine(l)}</p>)}</blockquote>);
      continue;
    }
    if (raw.startsWith('- ')) { nodes.push(<li key={i} className="ml-4 text-sm list-disc text-foreground">{parseLine(raw.slice(2))}</li>); i++; continue; }
    if (raw.trim()==='') { nodes.push(<div key={i} className="h-1.5"/>); i++; continue; }
    nodes.push(<p key={i} className="text-sm leading-relaxed text-foreground">{parseLine(raw)}</p>); i++;
  }
  return <div className="space-y-1">{nodes}</div>;
};

const RichBody = ({ text }) => {
  if (!text) return null;
  if (isHTMLContent(text)) {
    return (
      <div
        className="text-sm leading-relaxed quill-content text-foreground"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }
  return <MarkdownBody text={text} />;
};

// ═══════════════════════════════════════════════════════════════
// QUILL EDITOR
// ═══════════════════════════════════════════════════════════════
const QuillEditor = ({
  value, onChange, placeholder, minHeight = 140,
  token, onUploadStart, onUploadEnd, disabled = false,
}) => {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback(() => { fileInputRef.current?.click(); }, []);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return;
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10 MB.'); return; }
    onUploadStart?.();
    try {
      const res = await forumApi.uploadForumMedia(token, file);
      const url  = res.data.url;
      const type = isImage ? 'image' : 'video';
      const quill = quillRef.current?.getEditor();
      if (!quill) return;
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, type, url);
      quill.setSelection(range.index + 1, 0);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      onUploadEnd?.();
      e.target.value = '';
    }
  }, [token, onUploadStart, onUploadEnd]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [['image', 'video']],
      handlers: { image: () => handleImageUpload() },
    },
    clipboard: { matchVisual: false },
  }), [handleImageUpload]);

  const formats = ['image', 'video'];

  return (
    <div className="quill-wrapper" style={{ '--quill-min-height': `${minHeight}px` }}>
      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
      <ReactQuill
        ref={quillRef} theme="snow" value={value} onChange={onChange}
        modules={modules} formats={formats} placeholder={placeholder} readOnly={disabled}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPOSER
// ═══════════════════════════════════════════════════════════════
const Composer = ({
  placeholder = 'Write your reply...', initialValue = '', onSubmit, onCancel,
  submitLabel = 'Post Reply', compact = false, quoteText = null, loading = false,
  autoFocus = false, token,
}) => {
  const initialHTML = useMemo(() => {
    if (quoteText) {
      const escaped = quoteText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<blockquote>${escaped.split('\n').join('<br>')}</blockquote><p></p>`;
    }
    if (initialValue) return isHTMLContent(initialValue) ? initialValue : `<p>${initialValue}</p>`;
    return '';
  }, [quoteText, initialValue]);

  const [body, setBody]           = useState(initialHTML);
  const [preview, setPreview]     = useState(false);
  const [uploading, setUploading] = useState(false);

  const submit = () => {
    if (isQuillEmpty(body) || loading || uploading) return;
    onSubmit(body);
    if (!onCancel) setBody('');
    setPreview(false);
  };

  const isSubmitDisabled = isQuillEmpty(body) || loading || uploading;

  return (
    <div className={`border border-border rounded-2xl overflow-hidden bg-background ${compact ? '' : 'shadow-sm'}`}>
      <div className="flex items-center px-3 py-2 border-b border-border bg-muted/20">
        <div className="flex-1" />
        {uploading && <span className="flex items-center gap-1.5 text-xs text-muted-foreground mr-3"><Spinner size="sm" /> Uploading…</span>}
        <button onClick={() => setPreview(v => !v)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${preview ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {preview ? (
        <div className="min-h-[90px] p-3">
          {isQuillEmpty(body) ? <p className="text-sm italic text-muted-foreground">Nothing to preview.</p> : <RichBody text={body} />}
        </div>
      ) : (
        <QuillEditor value={body} onChange={setBody} placeholder={placeholder} minHeight={compact ? 90 : 140}
          token={token} onUploadStart={() => setUploading(true)} onUploadEnd={() => setUploading(false)} disabled={loading} />
      )}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-border bg-muted/10">
        <span className="text-[10px] text-muted-foreground hidden sm:block">Use toolbar to add <strong>images</strong> or <strong>videos</strong></span>
        <div className="flex items-center gap-2 ml-auto">
          {onCancel && (
            <button onClick={onCancel} disabled={loading || uploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40 min-h-[36px]">
              Cancel
            </button>
          )}
          <button onClick={submit} disabled={isSubmitDisabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:opacity-90 disabled:opacity-40 active:scale-95 transition-all min-h-[36px]">
            {loading || uploading ? <Spinner size="sm" /> : <Send className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading…' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NEW THREAD MODAL
// ═══════════════════════════════════════════════════════════════
const NewThreadModal = ({ board, onClose, onSubmit, loading, token }) => {
  const [title, setTitle]         = useState('');
  const [body, setBody]           = useState('');
  const [tag, setTag]             = useState('');
  const [preview, setPreview]     = useState(false);
  const [error, setError]         = useState('');
  const [uploading, setUploading] = useState(false);

  const submit = () => {
    if (!title.trim())           { setError('Please enter a title.'); return; }
    if (title.trim().length < 5) { setError('Title must be at least 5 characters.'); return; }
    if (isQuillEmpty(body))      { setError('Content must not be empty.'); return; }
    onSubmit({ title: title.trim(), body, tag });
  };

  const isSubmitDisabled = loading || uploading;

  return (
    <div className="inset-0 z-50 flex flex-col bg-background sm:items-center sm:justify-center sm:bg-black/60 sm:backdrop-blur-sm">
      <div className="flex my-5 flex-col h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl sm:bg-background overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border bg-white shrink-0">
          <button onClick={onClose} disabled={isSubmitDisabled} className="p-2 -ml-2 sm:hidden rounded-xl hover:bg-muted disabled:opacity-40"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1 mx-2 sm:flex-none sm:mx-0">
            <h2 className="text-base font-black sm:text-lg text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>New Thread</h2>
            <p className="text-xs text-muted-foreground">in <span className="font-medium text-primary">{board.name}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} disabled={isSubmitDisabled} className="hidden px-4 py-2 text-sm font-medium sm:block rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-40">Cancel</button>
            <button onClick={submit} disabled={isSubmitDisabled}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 disabled:opacity-60 active:scale-95 transition-all">
              {isSubmitDisabled ? <Spinner size="sm" /> : null}
              {uploading ? 'Uploading…' : loading ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 space-y-4 sm:p-6">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-400 border rounded-xl bg-red-500/10 border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">Thread Title *</label>
              <input type="text" value={title} onChange={e => { setTitle(e.target.value); setError(''); }}
                disabled={isSubmitDisabled} placeholder="Write a clear, descriptive title..."
                className="w-full px-4 py-3 text-sm transition-all border bg-muted/30 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                style={{ fontSize: 16 }} />
              <p className="text-[10px] text-muted-foreground mt-1">{title.length} / 255</p>
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">Tag</label>
              <div className="flex gap-2 px-4 pb-1 -mx-4 overflow-x-auto sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
                {TAGS.map(t => (
                  <button key={t} onClick={() => setTag(tag === t ? '' : t)} disabled={isSubmitDisabled}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 transition-all active:scale-95 disabled:opacity-60
                    ${tag === t ? 'bg-primary text-white border-primary shadow-sm' : 'border-border text-muted-foreground hover:border-primary/50 bg-muted/30'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold tracking-wider uppercase text-muted-foreground">Content *</label>
                <div className="flex items-center gap-2">
                  {uploading && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Spinner size="sm" />Uploading…</span>}
                  <button onClick={() => setPreview(v => !v)} disabled={isSubmitDisabled}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${preview ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
                    {preview ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>
              {preview ? (
                <div className="min-h-[200px] p-4 border border-border rounded-2xl">
                  {isQuillEmpty(body) ? <p className="text-sm italic text-muted-foreground">Nothing to preview.</p> : <RichBody text={body} />}
                </div>
              ) : (
                <div className="overflow-hidden border border-border rounded-2xl">
                  <QuillEditor value={body} onChange={setBody}
                    placeholder="Share your thoughts, questions, or findings... Add images/videos with the toolbar."
                    minHeight={200} token={token} onUploadStart={() => setUploading(true)} onUploadEnd={() => setUploading(false)} disabled={isSubmitDisabled} />
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                <Image className="w-3 h-3" /> Images and videos supported via the toolbar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// EDIT THREAD MODAL
// ═══════════════════════════════════════════════════════════════
const EditThreadModal = ({ thread, onClose, onSubmit, loading, token }) => {
  const [title, setTitle]         = useState(thread.title ?? '');
  const [body, setBody]           = useState(thread.body  ?? '');
  const [tag, setTag]             = useState(thread.tag   ?? '');
  const [preview, setPreview]     = useState(false);
  const [error, setError]         = useState('');
  const [uploading, setUploading] = useState(false);

  const submit = () => {
    if (!title.trim())           { setError('Please enter a title.'); return; }
    if (title.trim().length < 5) { setError('Title must be at least 5 characters.'); return; }
    if (isQuillEmpty(body))      { setError('Content must not be empty.'); return; }
    onSubmit({ title: title.trim(), body, tag });
  };

  const isSubmitDisabled = loading || uploading;

  return (
    <div className="inset-0 z-50 flex flex-col bg-background sm:items-center sm:justify-center sm:bg-black/60 sm:backdrop-blur-sm">
      <div className="my-5 flex flex-col h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl sm:bg-background overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border bg-white shrink-0">
          <button onClick={onClose} disabled={isSubmitDisabled} className="p-2 -ml-2 sm:hidden rounded-xl hover:bg-muted disabled:opacity-40"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1 mx-2 sm:flex-none sm:mx-0">
            <h2 className="text-base font-black sm:text-lg text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>Edit Thread</h2>
            <p className="text-xs text-muted-foreground">Changes are saved immediately</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} disabled={isSubmitDisabled} className="hidden px-4 py-2 text-sm font-medium sm:block rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-40">Cancel</button>
            <button onClick={submit} disabled={isSubmitDisabled}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 disabled:opacity-60 active:scale-95 transition-all">
              {isSubmitDisabled ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
              {uploading ? 'Uploading\u2026' : loading ? 'Saving\u2026' : 'Save'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 space-y-4 sm:p-6">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-400 border rounded-xl bg-red-500/10 border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">Thread Title *</label>
              <input type="text" value={title} onChange={e => { setTitle(e.target.value); setError(''); }}
                disabled={isSubmitDisabled} placeholder="Write a clear, descriptive title..."
                className="w-full px-4 py-3 text-sm transition-all border bg-muted/30 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                style={{ fontSize: 16 }} />
              <p className="text-[10px] text-muted-foreground mt-1">{title.length} / 255</p>
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">Tag</label>
              <div className="flex gap-2 px-4 pb-1 -mx-4 overflow-x-auto sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
                {TAGS.map(t => (
                  <button key={t} onClick={() => setTag(tag === t ? '' : t)} disabled={isSubmitDisabled}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 transition-all active:scale-95 disabled:opacity-60
                    ${tag === t ? 'bg-primary text-white border-primary shadow-sm' : 'border-border text-muted-foreground hover:border-primary/50 bg-muted/30'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold tracking-wider uppercase text-muted-foreground">Content *</label>
                <div className="flex items-center gap-2">
                  {uploading && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Spinner size="sm" />Uploading…</span>}
                  <button onClick={() => setPreview(v => !v)} disabled={isSubmitDisabled}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${preview ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
                    {preview ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>
              {preview ? (
                <div className="min-h-[200px] p-4 border border-border rounded-2xl">
                  {isQuillEmpty(body) ? <p className="text-sm italic text-muted-foreground">Nothing to preview.</p> : <RichBody text={body} />}
                </div>
              ) : (
                <div className="overflow-hidden border border-border rounded-2xl">
                  <QuillEditor value={body} onChange={setBody} placeholder="Edit your thread content..."
                    minHeight={200} token={token} onUploadStart={() => setUploading(true)} onUploadEnd={() => setUploading(false)} disabled={isSubmitDisabled} />
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                <Image className="w-3 h-3" /> Images and videos supported via the toolbar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// POST CARD — clickable author names route to user profile
// ═══════════════════════════════════════════════════════════════
const PostCard = ({ post, isOP=false, depth=0, onVote, onReply, onQuote, onEdit, onDelete, onViewProfile, currentUser, token }) => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [editing, setEditing]         = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const isOwn   = post.authorId !== null && post.authorId === currentUser?.id;
  const menuRef = useRef();

  useEffect(() => {
    const close = e => { if(menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleEdit = async body => { setEditLoading(true); try { await onEdit(post.id, body); } finally { setEditLoading(false); setEditing(false); } };

  return (
    <div id={`post-${post.id}`}
      className={`rounded-2xl border overflow-hidden transition-colors
      ${isOP ? 'bg-primary/5 border-primary/20' : depth>0 ? 'bg-background border-border/50' : 'bg-muted/10 border-border/60'}`}>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-0">
        <button
          onClick={() => post.authorId && onViewProfile?.(post.authorId, { first_name: post.authorName })}
          className="shrink-0 focus:outline-none"
          title={`View ${post.authorName}'s profile`}>
          <Avatar name={post.authorName} size={depth>0?'xs':'md'} className="transition-all hover:ring-2 hover:ring-primary/40" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => post.authorId && onViewProfile?.(post.authorId, { first_name: post.authorName })}
              className={`font-bold text-sm leading-none hover:underline transition-colors ${isOwn ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
              {post.authorName}
            </button>
            {isOP  && <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-primary/10 text-primary leading-none">OP</span>}
            {isOwn && <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 leading-none">You</span>}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-muted-foreground" title={formatDate(post.createdAt)}>{timeAgo(post.createdAt)}</span>
            {post.updatedAt && <span className="text-[10px] text-muted-foreground/50 italic">· edited</span>}
          </div>
        </div>
        {!isOP && (
          <div className="flex flex-col-reverse items-end">
            <button onClick={() => setMenuOpen(v => !v)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div ref={menuRef} className="absolute overflow-visible shrink-0">
              {menuOpen && (
                <div className="top-10 z-[2000] bg-white border border-border rounded-2xl shadow-2xl min-w-[160px] py-1.5 overflow-visible">
                  <button onClick={() => { onReply(post); setMenuOpen(false); }} className="flex items-center w-full gap-3 px-4 py-2.5 text-sm hover:bg-muted text-foreground transition-colors"><CornerDownRight className="w-4 h-4" />Reply</button>
                  <button onClick={() => { onQuote(post); setMenuOpen(false); }} className="flex items-center w-full gap-3 px-4 py-2.5 text-sm hover:bg-muted text-foreground transition-colors"><Quote className="w-4 h-4" />Quote</button>
                  {post.authorId && (
                    <button onClick={() => { onViewProfile?.(post.authorId, { first_name: post.authorName }); setMenuOpen(false); }} className="flex items-center w-full gap-3 px-4 py-2.5 text-sm hover:bg-muted text-foreground transition-colors"><Users className="w-4 h-4" />View Profile</button>
                  )}
                  {isOwn && <>
                    <div className="mx-3 my-1 border-t border-border" />
                    <button onClick={() => { setEditing(true); setMenuOpen(false); }} className="flex items-center w-full gap-3 px-4 py-2.5 text-sm hover:bg-muted text-foreground transition-colors"><Edit3 className="w-4 h-4" />Edit Post</button>
                    <button onClick={() => { onDelete(post.id); setMenuOpen(false); }} className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" />Delete</button>
                  </>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-3.5 pt-2.5 pb-1">
        {editing
          ? <Composer initialValue={post.body} onSubmit={handleEdit} onCancel={() => setEditing(false)} submitLabel="Save Edit" compact loading={editLoading} token={token} />
          : <RichBody text={post.body} />
        }
      </div>

      {/* Action bar */}
      {!isOP && !editing && (
        <div className="flex items-center px-2 py-1.5 border-t border-border/40 mt-1.5 bg-muted/10">
          <div className="flex items-center gap-0.5">
            <button onClick={() => onVote(post.id, 1)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${post.userVote===1?'bg-primary/10 text-primary':'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{post.votes>0?formatCount(post.votes):post.votes<0?post.votes:''}</span>
            </button>
            <button onClick={() => onVote(post.id, -1)}
              className={`p-1.5 rounded-xl transition-all active:scale-95 ${post.userVote===-1?'bg-red-500/10 text-red-400':'text-muted-foreground hover:bg-muted hover:text-red-400'}`}>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {post.votes===0 && <span className="px-1 text-xs text-muted-foreground">0</span>}
          </div>
          <div className="flex-1" />
          <button onClick={() => onQuote(post)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95">
            <Quote className="w-3.5 h-3.5" /><span className="hidden sm:inline">Quote</span>
          </button>
          <button onClick={() => onReply(post)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
            <CornerDownRight className="w-3.5 h-3.5" /><span>Reply</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// POST TREE
// ═══════════════════════════════════════════════════════════════
const PostTree = ({ post, depth=0, onVote, onReply, onQuote, onEdit, onDelete, onViewProfile, currentUser, token }) => {
  const np = normalisePost(post);
  const hasReplies = np.replies.length > 0;
  const [expanded, setExpanded] = useState(false);
  const indent = Math.min(depth, 2) * 12;

  return (
    <div style={depth>0?{marginLeft:indent,marginTop:8}:{}}>
      {depth>0 && <div className="flex items-center gap-1 mb-1.5"><div className="w-4 h-0.5 rounded-full bg-border/60"/><div className="flex-1 h-px bg-border/30"/></div>}
      <PostCard post={np} depth={depth} onVote={onVote} onReply={onReply} onQuote={onQuote} onEdit={onEdit} onDelete={onDelete} onViewProfile={onViewProfile} currentUser={currentUser} token={token}/>
      {hasReplies && (
        <>
          {!expanded && (
            <button onClick={()=>setExpanded(true)} className="mt-2 ml-2 flex items-center gap-2 text-xs font-semibold text-primary/70 hover:text-primary transition-colors py-1.5 px-2 rounded-xl hover:bg-primary/5 active:scale-95">
              <CornerDownRight className="w-3.5 h-3.5"/>Show {np.replies.length} {np.replies.length===1?'reply':'replies'}
            </button>
          )}
          {expanded && (
            <>
              <button onClick={()=>setExpanded(false)} className="mt-2 ml-2 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-xl hover:bg-muted active:scale-95">
                <ChevronUp className="w-3.5 h-3.5"/>Collapse replies
              </button>
              <div className="pl-3 mt-2 ml-2 space-y-2 border-l-2" style={{borderColor:'color-mix(in srgb,var(--color-primary,#6366f1) 20%,transparent)'}}>
                {np.replies.map(r=><PostTree key={r.id} post={r} depth={depth+1} onVote={onVote} onReply={onReply} onQuote={onQuote} onEdit={onEdit} onDelete={onDelete} onViewProfile={onViewProfile} currentUser={currentUser} token={token}/>)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// THREAD VIEW
// ═══════════════════════════════════════════════════════════════
const ThreadView = ({ thread, board, onBack, currentUser, token, toast, onViewProfile }) => {
  const [posts, setPosts]               = useState([]);
  const [meta, setMeta]                 = useState({ current_page:1, last_page:1, total:0 });
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError]     = useState(null);
  const [sort, setSort]                 = useState('oldest');
  const [page, setPage]                 = useState(1);
  const [replyingTo, setReplyingTo]     = useState(null);
  const [quotingPost, setQuotingPost]   = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [localThread, setLocalThread]   = useState(thread);
  const [composerOpen, setComposerOpen]     = useState(false);
  const [editThreadOpen, setEditThreadOpen] = useState(false);
  const [editThreadLoading, setEditThreadLoading] = useState(false);
  const composerRef = useRef();

  const fetchPosts = useCallback(async (p=1) => {
    setLoadingPosts(true); setPostsError(null);
    try {
      const res=await forumApi.getThread(token,localThread.slug,{page:p,per_page:POSTS_PER_PAGE,sort});
      const pay=res.data??{}, pp=pay.posts??{}, tm=pay.meta??{};
      setPosts(pp.data??[]);
      setMeta({current_page:tm.current_page??pp.current_page??p, last_page:tm.last_page??pp.last_page??1, total:tm.total??pp.total??0});
      if(pay.thread) setLocalThread(prev=>({...prev,...pay.thread}));
    } catch(e) { setPostsError(e.response?.data?.message??e.message??'Unknown error'); }
    finally { setLoadingPosts(false); }
  },[token,localThread.slug,sort]);

  useEffect(()=>{ fetchPosts(page); },[page,sort]);

  const submitReply = async body => {
    setReplyLoading(true);
    try {
      await forumApi.createPost(token,localThread.id,{body,parent_id:replyingTo?.id??null});
      await fetchPosts(page);
      setLocalThread(t=>({...t,reply_count:(t.reply_count??0)+1}));
      setReplyingTo(null); setQuotingPost(null); setComposerOpen(false);
      toast('Reply posted!','success');
    } catch(e) { toast(e.response?.data?.message??e.message,'error'); }
    finally { setReplyLoading(false); }
  };

  const findInTree=(list,id)=>{for(const p of list){if(p.id===id)return p;const f=findInTree(p.replies??[],id);if(f)return f;}return null;};
  const patchTree=(list,id,fn)=>list.map(p=>p.id===id?fn(p):{...p,replies:patchTree(p.replies??[],id,fn)});
  const removeFromTree=(list,id)=>list.filter(p=>p.id!==id).map(p=>({...p,replies:removeFromTree(p.replies??[],id)}));

  const handleVotePost = async (postId,val) => {
    const prev=findInTree(posts,postId); if(!prev)return;
    const nv=prev.user_vote===val?null:val, diff=(nv??0)-(prev.user_vote??0);
    setPosts(p=>patchTree(p,postId,x=>({...x,user_vote:nv,vote_count:(x.vote_count??0)+diff})));
    try { const res=await forumApi.votePost(token,postId,val); setPosts(p=>patchTree(p,postId,x=>({...x,vote_count:res.data.vote_count,user_vote:res.data.user_vote}))); }
    catch(e) { setPosts(p=>patchTree(p,postId,x=>({...x,user_vote:prev.user_vote,vote_count:(x.vote_count??0)-diff}))); toast(e.response?.data?.message??e.message,'error'); }
  };
  const handleVoteThread = async val => {
    const snap={...localThread}, nv=(localThread.user_vote??null)===val?null:val;
    setLocalThread(t=>({...t,user_vote:nv,vote_count:(t.vote_count??0)+(nv??0)-(t.user_vote??0)}));
    try { const res=await forumApi.voteThread(token,localThread.id,val); setLocalThread(t=>({...t,vote_count:res.data.vote_count,user_vote:res.data.user_vote})); }
    catch(e) { setLocalThread(snap); toast(e.response?.data?.message??e.message,'error'); }
  };
  const handleEditPost = async (postId,body) => {
    try { const res=await forumApi.updatePost(token,postId,body); const nb=res.data.post?.body??body,ea=res.data.post?.updated_at??new Date().toISOString(); setPosts(p=>patchTree(p,postId,x=>({...x,body:nb,updated_at:ea}))); toast('Post updated.','success'); }
    catch(e) { toast(e.response?.data?.message??e.message,'error'); throw e; }
  };
  const handleDeletePost = async postId => {
    if(!window.confirm('Delete this post?'))return;
    const snap=[...posts];
    setPosts(p=>removeFromTree(p,postId)); setLocalThread(t=>({...t,reply_count:Math.max(0,(t.reply_count??1)-1)}));
    try { await forumApi.deletePost(token,postId); toast('Post deleted.','success'); }
    catch(e) { setPosts(snap); setLocalThread(t=>({...t,reply_count:(t.reply_count??0)+1})); toast(e.response?.data?.message??e.message,'error'); }
  };

  const handleEditThread = async ({ title, body, tag }) => {
    setEditThreadLoading(true);
    try {
      const res = await forumApi.updateThread(token, localThread.id, { title, body, tag: tag || null });
      const updated = res.data.thread ?? {};
      setLocalThread(prev => ({
        ...prev,
        title:      updated.title      ?? title,
        body:       updated.body       ?? body,
        tag:        updated.tag        ?? tag,
        updated_at: updated.updated_at ?? new Date().toISOString(),
      }));
      setEditThreadOpen(false);
      toast('Thread updated!', 'success');
    } catch (e) {
      toast(e.response?.data?.message ?? e.message, 'error');
    } finally {
      setEditThreadLoading(false);
    }
  };

  const doReply = post => { const np=normalisePost(post); setReplyingTo(np); setQuotingPost(null); setComposerOpen(true); setTimeout(()=>composerRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),150); };
  const doQuote = post => { const np=normalisePost(post); setQuotingPost(np); setReplyingTo(np); setComposerOpen(true); setTimeout(()=>composerRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),150); };

  const opPost = normalisePost({ id:`op-${localThread.id}`, author:localThread.author??localThread.authorName??'Unknown', author_id:localThread.author_id??localThread.authorId??null, body:localThread.body??'', vote_count:localThread.vote_count??0, user_vote:localThread.user_vote??null, created_at:localThread.created_at??localThread.createdAt, replies:[] });

  return (
    <div className="space-y-3 pb-28 sm:pb-6">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={()=>onBack('home')} className="flex items-center gap-1 py-1 transition-colors hover:text-primary"><Home className="w-3 h-3"/><span className="hidden sm:inline">Forums</span></button>
        <ChevronRight className="w-3 h-3 shrink-0"/>
        <button onClick={()=>onBack('board')} className="hover:text-primary transition-colors truncate max-w-[80px] sm:max-w-[140px] py-1">{board.name}</button>
        <ChevronRight className="w-3 h-3 shrink-0"/>
        <span className="font-medium truncate text-foreground">{localThread.title}</span>
      </nav>

      <div className="p-4 border sm:p-5 bg-background border-border rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {localThread.is_pinned && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Pin className="w-2.5 h-2.5"/>Pinned</span>}
          {localThread.is_locked && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border"><Lock className="w-2.5 h-2.5"/>Locked</span>}
          {localThread.is_hot    && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20"><Flame className="w-2.5 h-2.5"/>Hot</span>}
          {localThread.tag       && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">{localThread.tag}</span>}
        </div>
        <h1 className="mb-2 text-lg font-black leading-tight sm:text-xl text-foreground" style={{fontFamily:"'Sora',sans-serif"}}>{localThread.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span>by{' '}
            <button
              onClick={() => localThread.author_id && onViewProfile?.(localThread.author_id, { first_name: localThread.author ?? localThread.authorName })}
              className="font-semibold transition-colors text-primary hover:underline">
              {localThread.author ?? localThread.authorName}
            </button>
          </span>
          <span title={formatDate(localThread.created_at??localThread.createdAt)}>{timeAgo(localThread.created_at??localThread.createdAt)}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{formatCount(localThread.view_count??0)}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3"/>{meta.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden border rounded-xl border-border">
            <button onClick={()=>handleVoteThread(1)} className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${localThread.user_vote===1?'bg-primary text-white':'hover:bg-muted text-muted-foreground hover:text-primary'}`}>
              <ChevronUp className="w-4 h-4"/><span>{localThread.vote_count??0}</span>
            </button>
            <div className="w-px h-6 bg-border"/>
            <button onClick={()=>handleVoteThread(-1)} className={`px-3 py-2 transition-all active:scale-95 ${localThread.user_vote===-1?'bg-red-500 text-white':'hover:bg-muted text-muted-foreground hover:text-red-400'}`}>
              <ChevronDown className="w-4 h-4"/>
            </button>
          </div>
          <div className="flex-1"/>
          <span className="text-xs text-muted-foreground">{meta.total} {meta.total===1?'reply':'replies'}</span>
          {!localThread.is_locked && localThread.author_id === currentUser?.id && (
            <button onClick={() => setEditThreadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95">
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Thread</span>
            </button>
          )}
          <button onClick={()=>fetchPosts(page)} className="p-2 transition-colors rounded-xl hover:bg-muted text-muted-foreground active:scale-95"><RefreshCw className="w-3.5 h-3.5"/></button>
        </div>
      </div>

      {editThreadOpen && (
        <EditThreadModal thread={localThread} onClose={() => setEditThreadOpen(false)} onSubmit={handleEditThread} loading={editThreadLoading} token={token} />
      )}

      <PostCard post={opPost} isOP depth={0} onVote={()=>{}} onReply={doReply} onQuote={doQuote} onEdit={()=>{}} onDelete={()=>{}} onViewProfile={onViewProfile} currentUser={currentUser} token={token}/>

      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
        <span className="text-xs text-muted-foreground shrink-0">Sort:</span>
        {[['oldest','Oldest'],['newest','Newest'],['top','Top Voted']].map(([v,l])=>(
          <button key={v} onClick={()=>{setSort(v);setPage(1);}} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 ${sort===v?'bg-primary text-white shadow-sm':'border border-border text-muted-foreground hover:bg-muted bg-background'}`}>{l}</button>
        ))}
      </div>

      {loadingPosts
        ? <div className="flex justify-center py-12"><Spinner size="lg"/></div>
        : postsError
          ? <ErrorState message={postsError} onRetry={()=>fetchPosts(page)}/>
          : posts.length>0
            ? <div className="space-y-3">{posts.map(p=><PostTree key={p.id} post={p} depth={0} onVote={handleVotePost} onReply={doReply} onQuote={doQuote} onEdit={handleEditPost} onDelete={handleDeletePost} onViewProfile={onViewProfile} currentUser={currentUser} token={token}/>)}</div>
            : <div className="py-12 text-center border border-border rounded-2xl bg-background">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20 text-muted-foreground"/>
                <p className="font-semibold text-foreground">No replies yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Be the first to reply!</p>
                {!localThread.is_locked && <button onClick={()=>setComposerOpen(true)} className="mt-4 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 active:scale-95 transition-all">Write a reply</button>}
              </div>
      }

      {meta.last_page>1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted disabled:opacity-30 active:scale-95 transition-colors"><ChevronLeft className="w-4 h-4"/><span className="hidden sm:inline">Prev</span></button>
          <div className="items-center hidden gap-1 sm:flex">{Array.from({length:meta.last_page},(_,i)=>i+1).map(p=><button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${page===p?'bg-primary text-white':'hover:bg-muted text-muted-foreground'}`}>{p}</button>)}</div>
          <span className="sm:hidden text-xs font-semibold text-foreground px-2 py-1.5 rounded-lg bg-muted/50">Page {page} / {meta.last_page}</span>
          <button onClick={()=>setPage(p=>Math.min(meta.last_page,p+1))} disabled={page===meta.last_page} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted disabled:opacity-30 active:scale-95 transition-colors"><span className="hidden sm:inline">Next</span><ChevronRight className="w-4 h-4"/></button>
        </div>
      )}

      {!localThread.is_locked && (
        <div ref={composerRef} className="hidden overflow-hidden border sm:block rounded-2xl border-border bg-background">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20">
            <Avatar name={currentUser?.first_name||'You'} size="md"/>
            <div>
              <p className="text-sm font-semibold text-foreground">{replyingTo?<span>Replying to <span className="text-primary">{replyingTo.authorName}</span></span>:'Post a Reply'}</p>
              {replyingTo && <button onClick={()=>{setReplyingTo(null);setQuotingPost(null);}} className="text-[10px] text-muted-foreground hover:text-foreground">× Clear</button>}
            </div>
          </div>
          <div className="p-3">
            <Composer
              key={`d-${replyingTo?.id}-${quotingPost?.id}`}
              placeholder={replyingTo?`Replying to ${replyingTo.authorName}...`:'Share your thoughts...'}
              quoteText={quotingPost?`${quotingPost.authorName} wrote:\n${(quotingPost.body??'').replace(/<[^>]+>/g,'').slice(0,200)}`:''}
              onSubmit={submitReply}
              onCancel={replyingTo?()=>{setReplyingTo(null);setQuotingPost(null);}:null}
              loading={replyLoading} compact token={token}
            />
          </div>
        </div>
      )}
      {localThread.is_locked && <div className="flex items-center gap-3 p-4 text-sm border text-muted-foreground border-border rounded-2xl bg-muted/10"><Lock className="w-4 h-4 shrink-0"/>Thread is locked.</div>}

      {!localThread.is_locked && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 border-t sm:hidden bg-background/97 backdrop-blur-md border-border">
          <button onClick={()=>{setComposerOpen(true);}} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-border bg-muted/30 active:scale-[0.98] transition-all">
            <Avatar name={currentUser?.first_name||'You'} size="sm"/>
            <span className="flex-1 text-sm text-left text-muted-foreground">{replyingTo?`Reply to ${replyingTo.authorName}...`:'Write a reply...'}</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold"><Pen className="w-3.5 h-3.5"/>Reply</div>
          </button>
        </div>
      )}

      <BottomSheet open={composerOpen&&!localThread.is_locked} onClose={()=>{setComposerOpen(false);setReplyingTo(null);setQuotingPost(null);}} title={replyingTo?`Reply to ${replyingTo.authorName}`:'Post a Reply'}>
        <div className="p-4 mb-[100px]">
          <Composer
            key={`m-${replyingTo?.id}-${quotingPost?.id}`}
            placeholder={replyingTo?`Replying to ${replyingTo.authorName}...`:'Share your thoughts...'}
            quoteText={quotingPost?`${quotingPost.authorName} wrote:\n${(quotingPost.body??'').replace(/<[^>]+>/g,'').slice(0,200)}`:''}
            onSubmit={body=>{submitReply(body);}}
            onCancel={()=>{setComposerOpen(false);setReplyingTo(null);setQuotingPost(null);}}
            loading={replyLoading} autoFocus token={token}
          />
        </div>
      </BottomSheet>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BOARD VIEW
// ═══════════════════════════════════════════════════════════════
const BoardView = ({ board, onBack, onSelectThread, onNewThread, onViewProfile, token }) => {
  const [threads, setThreads] = useState([]);
  const [meta, setMeta]       = useState({current_page:1,last_page:1,total:0});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [sort, setSort]       = useState('latest');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const debounceRef = useRef();

  const fetchThreads = useCallback(async (p=1,s=sort,q=search) => {
    setLoading(true); setError(null);
    try {
      const res=await forumApi.getBoard(token,board.slug,{page:p,per_page:THREADS_PER_PAGE,sort:s,search:q||undefined});
      setThreads(res.data.threads?.data??[]); setMeta(res.data.threads?.meta??{current_page:p,last_page:1,total:0});
    } catch(e) { setError(e.response?.data?.message??e.message); }
    finally { setLoading(false); }
  },[token,board.slug,sort,search]);

  useEffect(()=>{ fetchThreads(page,sort,search); },[page,sort]);
  useEffect(()=>{ clearTimeout(debounceRef.current); debounceRef.current=setTimeout(()=>{setPage(1);fetchThreads(1,sort,search);},400); return()=>clearTimeout(debounceRef.current); },[search]);

  return (
    <div className="pb-24 space-y-3 sm:pb-4">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <button onClick={onBack} className="flex items-center gap-1.5 hover:text-primary transition-colors py-1 font-medium"><ArrowLeft className="w-3.5 h-3.5"/><span className="hidden sm:inline">Forums</span><span className="sm:hidden">Back</span></button>
        <ChevronRight className="w-3 h-3"/><span className="font-semibold truncate text-foreground">{board.name}</span>
      </nav>
      <div className="p-4 bg-white border border-border rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-black sm:text-xl text-foreground" style={{fontFamily:"'Sora',sans-serif"}}>{board.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{board.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span><b className="text-foreground">{formatCount(board.thread_count??0)}</b> threads</span>
              <span><b className="text-foreground">{formatCount(board.post_count??0)}</b> posts</span>
            </div>
          </div>
          {!board.is_locked && (
            <button onClick={onNewThread} className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold bg-primary text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
              <Plus className="w-4 h-4"/><span className="hidden sm:inline">New Thread</span><span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1">
          {[['latest','Latest'],['hot','🔥 Hot'],['top','⬆️ Top']].map(([v,l])=>(
            <button key={v} onClick={()=>{setSort(v);setPage(1);}} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 ${sort===v?'bg-primary text-white shadow-sm':'border border-border text-muted-foreground hover:bg-muted bg-background'}`}>{l}</button>
          ))}
        </div>
        <button onClick={()=>setSearchOpen(v=>!v)} className={`p-2.5 rounded-xl border transition-colors active:scale-95 shrink-0 ${searchOpen?'bg-primary/10 border-primary/30 text-primary':'border-border hover:bg-muted text-muted-foreground'}`}><Search className="w-4 h-4"/></button>
        <button onClick={()=>fetchThreads(page,sort,search)} className="p-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground transition-colors active:scale-95 shrink-0"><RefreshCw className="w-4 h-4"/></button>
      </div>
      {searchOpen && (
        <div className="relative">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search threads..." autoFocus className="w-full py-3 pl-10 pr-4 text-sm border bg-muted/30 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" style={{fontSize:16}}/>
          {search && <button onClick={()=>setSearch('')} className="absolute p-1 -translate-y-1/2 rounded-full right-3 top-1/2 hover:bg-muted"><X className="w-3.5 h-3.5 text-muted-foreground"/></button>}
        </div>
      )}
      <div className="overflow-hidden border rounded-2xl border-border bg-background">
        <div className="hidden md:grid grid-cols-[1fr_56px_56px_56px] gap-2 px-4 py-2.5 border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Thread</span><span className="text-center">Votes</span><span className="text-center">Replies</span><span className="text-center">Views</span>
        </div>
        {loading
          ? <div className="flex justify-center py-16"><Spinner size="lg"/></div>
          : error
            ? <ErrorState message={error} onRetry={()=>fetchThreads(page,sort,search)}/>
            : threads.length>0
              ? <div className="divide-y divide-border">
                  {threads.map(t=>(
                    <button key={t.id} onClick={()=>onSelectThread(t)} className="w-full text-left md:grid md:grid-cols-[1fr_56px_56px_56px] flex flex-col gap-1.5 px-4 py-3.5 hover:bg-muted/20 active:bg-muted/30 transition-colors group">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {t.is_pinned&&<Pin className="w-3 h-3 text-amber-400 shrink-0"/>}
                          {t.is_locked&&<Lock className="w-3 h-3 text-muted-foreground shrink-0"/>}
                          {t.is_hot&&<Flame className="w-3 h-3 text-orange-400 shrink-0"/>}
                          {t.tag&&<span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary">{t.tag}</span>}
                          <span className="text-sm font-semibold transition-colors text-foreground group-hover:text-primary line-clamp-1">{t.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>by{' '}
                            <button
                              onClick={e => { e.stopPropagation(); t.author_id && onViewProfile?.(t.author_id, { first_name: t.author }); }}
                              className="font-medium transition-colors text-primary/80 hover:text-primary hover:underline">
                              {t.author}
                            </button>
                          </span>
                          <span>·</span><span title={formatDate(t.created_at)}>{timeAgo(t.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground md:hidden">
                          <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3"/>{formatCount(t.vote_count??0)}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3"/>{formatCount(t.reply_count??0)}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{formatCount(t.view_count??0)}</span>
                        </div>
                      </div>
                      <div className={`hidden md:flex items-center justify-center text-sm font-bold ${(t.vote_count??0)>0?'text-primary':'text-muted-foreground'}`}>{formatCount(t.vote_count??0)}</div>
                      <div className="items-center justify-center hidden text-sm font-semibold md:flex text-foreground">{formatCount(t.reply_count??0)}</div>
                      <div className="items-center justify-center hidden text-xs md:flex text-muted-foreground">{formatCount(t.view_count??0)}</div>
                    </button>
                  ))}
                </div>
              : <div className="py-16 text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30"/>
                  <p className="font-semibold">{search?'No threads match your search':'No threads yet'}</p>
                  {!search&&!board.is_locked&&<button onClick={onNewThread} className="mt-4 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 active:scale-95 transition-all">Post the first thread</button>}
                </div>
        }
      </div>
      {meta.last_page>1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted disabled:opacity-30 active:scale-95 transition-colors"><ChevronLeft className="w-4 h-4"/><span className="hidden sm:inline">Prev</span></button>
          <div className="items-center hidden gap-1 sm:flex">{Array.from({length:meta.last_page},(_,i)=>i+1).map(p=><button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${page===p?'bg-primary text-white':'hover:bg-muted text-muted-foreground'}`}>{p}</button>)}</div>
          <span className="sm:hidden text-xs font-semibold text-foreground px-2 py-1.5 rounded-lg bg-muted/50">{page} / {meta.last_page}</span>
          <button onClick={()=>setPage(p=>Math.min(meta.last_page,p+1))} disabled={page===meta.last_page} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted disabled:opacity-30 active:scale-95 transition-colors"><span className="hidden sm:inline">Next</span><ChevronRight className="w-4 h-4"/></button>
        </div>
      )}
      {!board.is_locked && (
        <button onClick={onNewThread} className="sm:hidden fixed bottom-6 right-4 z-30 flex items-center gap-2 px-5 py-3.5 rounded-full bg-primary text-white font-bold text-sm shadow-2xl shadow-primary/30 active:scale-95 transition-all">
          <Pen className="w-4 h-4"/>New Thread
        </button>
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
      const [catRes,statsRes]=await Promise.all([forumApi.getCategories(token),forumApi.getForumStats(token)]);
      setCategories(catRes.data.categories??[]); setStats(statsRes.data.stats??null);
    } catch(e) { setError(e.response?.data?.message??e.message); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ fetchHome(); },[]);

  const filtered = searchQuery
    ? categories.map(c=>({...c,boards:(c.boards??[]).filter(b=>b.name.toLowerCase().includes(searchQuery.toLowerCase())||b.description?.toLowerCase().includes(searchQuery.toLowerCase()))})).filter(c=>c.boards?.length>0)
    : categories;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg"/></div>;
  if (error)   return <ErrorState message={error} onRetry={fetchHome}/>;

  return (
    <>
      {filtered.length>0
        ? filtered.map(cat=>(
          <div key={cat.id} className="mb-4 overflow-hidden border rounded-2xl border-border bg-background">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border" style={{background:`${cat.color||'#6366f1'}12`}}>
              <span className="text-lg">{cat.icon}</span>
              <div><h2 className="text-sm font-black text-foreground" style={{fontFamily:"'Sora',sans-serif"}}>{cat.name}</h2><p className="text-xs text-muted-foreground">{cat.description}</p></div>
            </div>
            <div className="divide-y divide-border">
              {(cat.boards||[]).map(board=>(
                <button key={board.id} onClick={()=>onSelectBoard(board)} className="w-full text-left flex items-center gap-3 px-4 py-3.5 hover:bg-muted/20 active:bg-muted/30 transition-colors group">
                  <div className="flex items-center justify-center transition-colors border rounded-xl shrink-0 w-9 h-9 border-border bg-muted/40 group-hover:border-primary/40">
                    <MessageSquare className="w-4 h-4 transition-colors text-muted-foreground group-hover:text-primary"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold transition-colors text-foreground group-hover:text-primary">{board.name}</span>
                      {board.is_locked&&<Lock className="w-3 h-3 text-muted-foreground shrink-0"/>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{board.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground sm:hidden">
                      <span>{formatCount(board.thread_count??0)} threads</span>
                      <span>{formatCount(board.post_count??0)} posts</span>
                    </div>
                  </div>
                  {board.last_post && (
                    <div className="hidden lg:block text-xs text-right shrink-0 max-w-[150px]">
                      <p className="font-medium truncate text-foreground">{board.last_post.title}</p>
                      <p className="text-muted-foreground">by <span className="text-primary">{board.last_post.author}</span> · {timeAgo(board.last_post.created_at)}</p>
                    </div>
                  )}
                  <div className="items-center hidden gap-4 text-xs sm:flex lg:hidden text-muted-foreground shrink-0">
                    <div className="text-center"><p className="font-semibold text-foreground">{formatCount(board.thread_count??0)}</p><p>Threads</p></div>
                    <div className="text-center"><p className="font-semibold text-foreground">{formatCount(board.post_count??0)}</p><p>Posts</p></div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0"/>
                </button>
              ))}
            </div>
          </div>
        ))
        : <div className="py-16 text-center text-muted-foreground"><Search className="w-10 h-10 mx-auto mb-3 opacity-30"/><p className="font-semibold">No boards match your search</p></div>
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
  useEffect(()=>{ forumApi.getTrending(token,7,6).then(r=>setThreads(r.data.threads??[])).catch(()=>{}).finally(()=>setLoading(false)); },[token]);

  return (
    <aside>
      <div className="overflow-hidden border rounded-2xl border-border bg-background">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
          <Flame className="w-4 h-4 text-orange-400"/>
          <span className="text-sm font-bold text-foreground" style={{fontFamily:"'Sora',sans-serif"}}>Trending</span>
        </div>
        {loading
          ? <div className="flex justify-center py-8"><Spinner size="sm"/></div>
          : threads.length===0
            ? <p className="px-4 py-6 text-xs text-center text-muted-foreground">No trending threads yet</p>
            : <div className="divide-y divide-border">
                {threads.map((t,i)=>(
                  <button key={t.id} onClick={()=>onSelectThread(t)} className="w-full px-4 py-3 text-left transition-colors hover:bg-muted/20 active:bg-muted/30 group">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-black text-muted-foreground/40 mt-0.5 w-4 shrink-0">{i+1}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          {t.is_hot&&<Flame className="w-3 h-3 text-orange-400 shrink-0"/>}
                          {t.tag&&<span className="text-[10px] text-primary font-bold">{t.tag}</span>}
                        </div>
                        <p className="text-xs font-semibold leading-snug transition-colors text-foreground group-hover:text-primary line-clamp-2">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">by <span className="text-primary/80">{t.author}</span>{t.board&&` · ${t.board}`}</p>
                        <div className="flex items-center gap-2.5 mt-1 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><ChevronUp className="w-2.5 h-2.5"/>{formatCount(t.vote_count??0)}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5"/>{t.reply_count??0}</span>
                          <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5"/>{formatCount(t.view_count??0)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
        }
      </div>
    </aside>
  );
};

// ═══════════════════════════════════════════════════════════════
// USER SEARCH VIEW
// ═══════════════════════════════════════════════════════════════
const UserSearchView = ({ onSelectUser, token }) => {
  const [query, setQuery]       = useState('');
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [searched, setSearched] = useState(false);
  const debounceRef             = useRef();

  const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_URL ?? '';

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setUsers([]); setSearched(false); setLoading(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true); setError(null); setSearched(false);
      try {
        const res = await forumApi.searchUsers(token, query.trim());
        // Support both { data: { users: [] } } and { data: { data: [] } } (paginated)
        const list = res.data?.data?.data ?? res.data?.data?.users ?? res.data?.users ?? [];
        setUsers(list);
        setSearched(true);
      } catch (e) {
        setError(e.response?.data?.message ?? e.message ?? 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, token]);

  const getMembershipBadge = (user) => {
    const type = user.accounts_table?.subscription__sales__transactions_one?.subscription_category?.membership_type?.type_title;
    return type ?? user.accounts_table?.user_type_table?.user_type_title ?? null;
  };

  const getMembershipColor = (title) => {
    if (!title) return { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' };
    if (title.toUpperCase() === 'VIP') return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
    if (title.toUpperCase() === 'PCA') return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
    if (title.toLowerCase() === 'admin') return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
    return { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' };
  };

  return (
    <div className="pb-24 space-y-3 sm:pb-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-4 top-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or account number..."
          autoFocus
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
          style={{ fontSize: 16 }}
        />
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
      {!loading && error && <ErrorState message={error} onRetry={() => setQuery(q => q + ' ')} />}

      {!loading && !error && !searched && (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 border rounded-2xl bg-primary/10 border-primary/20">
            <Users className="w-8 h-8 text-primary/60" />
          </div>
          <p className="font-black text-foreground text-lg mb-1.5" style={{ fontFamily: "'Sora',sans-serif" }}>Find Members</p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
            Search for members by name or account number to view their profiles
          </p>
        </div>
      )}

      {!loading && !error && searched && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="w-10 h-10 mb-3 text-muted-foreground/30" />
          <p className="font-semibold text-foreground">No members found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different name or account number</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground px-0.5">
            {users.length} {users.length === 1 ? 'member' : 'members'} found
          </p>
          <div className="overflow-hidden bg-white border divide-y shadow-sm border-border rounded-2xl divide-border">
            {users.map(user => {
              const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || `Member #${user.id}`;
              const accountNumber = user.accounts_table?.account_number;
              const membershipTitle = getMembershipBadge(user);
              const badgeColors = getMembershipColor(membershipTitle);
              const profilePhoto = user.user_profile?.upload_url;
              const country = user.country_table?.name;
              const isActive = user.users_is_active;

              return (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-muted/20 active:bg-muted/30 transition-colors group text-left">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {profilePhoto ? (
                      <img
                        src={`${STORAGE_URL}${profilePhoto}`}
                        alt={displayName}
                        className="object-cover transition-all shadow-sm w-11 h-11 rounded-xl ring-2 ring-white group-hover:ring-primary/30"
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white group-hover:ring-primary/30 transition-all shrink-0 ${profilePhoto ? 'hidden' : 'flex'}`}
                      style={{ background: avatarColor(user.first_name || '?') }}>
                      {((user.first_name || '?').slice(0, 1) + (user.last_name || '').slice(0, 1)).toUpperCase()}
                    </div>
                    {isActive && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold truncate transition-colors text-foreground group-hover:text-primary">
                        {displayName}
                      </p>
                      {user.nick_names && (
                        <span className="text-xs font-normal text-muted-foreground shrink-0">"{user.nick_names}"</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {accountNumber && (
                        <span className="font-mono text-xs text-muted-foreground">@{accountNumber}</span>
                      )}
                      {membershipTitle && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border}`}>
                          {membershipTitle}
                        </span>
                      )}
                      {country && (
                        <span className="text-[10px] text-muted-foreground">{country}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-colors text-muted-foreground/40 shrink-0 group-hover:text-primary/50" />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// USER PROFILE VIEW
// ═══════════════════════════════════════════════════════════════
const UserProfileView = ({ userId, userSeed, onSelectThread, token, currentUser }) => {
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_URL ?? '';

  const fetchProfile = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await forumApi.getUserProfile(token, userId);
      // Shape: { data: { user: { info: {}, thread_count, post_count, total_votes, threads, recent_posts } } }
      const userBlock = res.data?.data?.user ?? res.data?.user ?? {};
      const info      = userBlock.info ?? userBlock;
      setProfile({
        ...info,
        thread_count:  userBlock.thread_count  ?? 0,
        post_count:    userBlock.post_count    ?? 0,
        total_votes:   userBlock.total_votes   ?? 0,
        threads:       userBlock.threads       ?? [],
        recent_posts:  userBlock.recent_posts  ?? [],
      });
    } catch (e) {
      setError(e.response?.data?.message ?? e.message ?? 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (error)   return <ErrorState message={error} onRetry={fetchProfile} />;
  if (!profile) return null;

  const isOwn         = profile.id === currentUser?.id;
  const fullName      = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || `Member #${profile.id}`;
  const initials      = ((profile.first_name || '?').slice(0, 1) + (profile.last_name || '').slice(0, 1)).toUpperCase();
  const accent        = avatarColor(profile.first_name || '?');
  const account       = profile.accounts_table ?? {};
  const accountNum    = account.account_number;
  const profilePhoto  = profile.user_profile?.upload_url;
  const contentPhotos = (profile.user_uploads_table ?? []).filter(u => u.upload_type === 'contents' && !u.upload_is_deleted);
  const country       = profile.country_table?.name;
  const memberType    = account.subscription__sales__transactions_one?.subscription_category?.membership_type?.type_title
                     ?? account.user_type_table?.user_type_title;
  const isVIP         = memberType?.toUpperCase() === 'VIP';
  const isPCA         = memberType?.toUpperCase() === 'PCA';
  const isAdmin       = account.user_type_table?.user_type_is_admin;

  const params        = profile.params ?? {};
  const socialMedia   = params.social_media && !Array.isArray(params.social_media) ? params.social_media : null;
  const bucketList    = Array.isArray(params.bucket_list) ? params.bucket_list : [];
  const hobbies       = Array.isArray(params.hobbies) ? params.hobbies.filter(Boolean) : [];
  const youtubeVids   = Array.isArray(params.youtube_videos) ? params.youtube_videos.filter(Boolean) : [];

  const directs       = account.distribution?.length ?? 0;
  const subsStart     = account.subscription__sales__transactions_one?.subscription_start;

  const threads      = profile.threads      ?? [];
  const recentPosts  = profile.recent_posts ?? [];

  const threadCount  = profile.thread_count;
  const postCount    = profile.post_count;
  const totalVotes   = profile.total_votes;

  const getYouTubeId = url => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&\s]+)/);
    return m ? m[1] : null;
  };

  const tabList = [
    ['about',   'About'],
    ['threads', `Threads${threadCount > 0 ? ` (${threadCount})` : ''}`],
    ['replies', `Replies${postCount   > 0 ? ` (${postCount})`   : ''}`],
    ...(contentPhotos.length > 0 ? [['photos',  `Photos (${contentPhotos.length})`]] : []),
    ...(bucketList.length    > 0 ? [['bucket',  'Bucket List']] : []),
    ...(youtubeVids.length   > 0 ? [['videos',  'Videos']]       : []),
  ];

  return (
    <div className="pb-24 space-y-4 sm:pb-4">

      {/* ── Profile card ── */}
      <div className="overflow-hidden bg-white border shadow-sm border-border rounded-2xl">
        {/* Banner */}
        <div className="relative overflow-hidden h-28 sm:h-36"
          style={{ background: `linear-gradient(135deg, ${accent}40 0%, ${accent}18 60%, #f0f4ff 100%)` }}>
          <div className="absolute rounded-full -right-8 -top-8 w-36 h-36 opacity-20" style={{ background: accent }} />
          <div className="absolute w-16 h-16 rounded-full right-20 top-6 opacity-10" style={{ background: accent }} />
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-end justify-between mb-4 -mt-12">
            {/* Avatar */}
            <div className="relative">
              {profilePhoto ? (
                <img
                  src={`${STORAGE_URL}${profilePhoto}`}
                  alt={fullName}
                  className="object-cover w-20 h-20 border-4 border-white shadow-lg sm:w-24 sm:h-24 rounded-2xl"
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-lg items-center justify-center font-black text-white text-2xl select-none ${profilePhoto ? 'hidden' : 'flex'}`}
                style={{ background: accent }}>
                {initials}
              </div>
              {profile.users_is_active && (
                <span className="absolute w-4 h-4 border-2 border-white rounded-full shadow bottom-1 right-1 bg-emerald-400" />
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap justify-end">
              {isOwn && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Check className="w-3 h-3" /> You
                </span>
              )}
              {isAdmin && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
              {isVIP && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">★ VIP</span>
              )}
              {isPCA && !isVIP && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">PCA</span>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-xl font-black leading-tight text-foreground" style={{ fontFamily: "'Sora',sans-serif" }}>
            {fullName}
          </h1>
          {profile.nick_names && (
            <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>"{profile.nick_names}"</p>
          )}
          {params.personal_introduction && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{params.personal_introduction}</p>
          )}

          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {accountNum && (
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md border border-border/60">
                @{accountNum}
              </span>
            )}
            {country && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60">{country}</span>
            )}
            {params.occupation && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60">{params.occupation}</span>
            )}
            {params.company && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60">{params.company}</span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-0 pt-4 mt-4 border-t border-border">
            {[
              { label: 'Threads', value: threadCount },
              { label: 'Replies', value: postCount },
              { label: 'Votes',   value: totalVotes },
              { label: 'Directs', value: directs },
            ].map(({ label, value }, idx, arr) => (
              <div key={label} className={`text-center py-1 ${idx < arr.length - 1 ? 'border-r border-border' : ''}`}>
                <p className="text-base font-black leading-none text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
        {tabList.map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95
            ${activeTab === v ? 'bg-primary text-white shadow-sm' : 'border border-border text-muted-foreground hover:bg-muted bg-white'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ── About tab ── */}
      {activeTab === 'about' && (
        <div className="space-y-3">
          {(params.company || params.business_description) && (
            <div className="p-4 bg-white border border-border rounded-2xl">
              <p className="mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">Company</p>
              {params.company && <p className="text-sm font-semibold text-foreground">{params.company}</p>}
              {params.business_description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{params.business_description}</p>}
            </div>
          )}

          {hobbies.length > 0 && (
            <div className="p-4 bg-white border border-border rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">Hobbies</p>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((h, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/8 text-primary border border-primary/20">{h}</span>
                ))}
              </div>
            </div>
          )}

          {subsStart && memberType && (
            <div className="p-4 bg-white border border-border rounded-2xl">
              <p className="mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">Membership</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{memberType}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Since {new Date(subsStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isVIP ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                  {memberType}
                </span>
              </div>
            </div>
          )}

          {socialMedia && Object.values(socialMedia).some(Boolean) && (
            <div className="p-4 bg-white border border-border rounded-2xl">
              <p className="mb-3 text-xs font-bold tracking-wider uppercase text-muted-foreground">Social Media</p>
              <div className="space-y-2">
                {socialMedia.facebook && (
                  <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="flex items-center justify-center bg-blue-600 rounded-lg w-7 h-7 shrink-0">
                      <span className="text-xs font-bold text-white">f</span>
                    </div>
                    <span className="flex-1 text-sm font-medium text-blue-700">Facebook</span>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </a>
                )}
                {socialMedia.instagram && (
                  <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-pink-50 border border-pink-100 hover:bg-pink-100 transition-colors">
                    <div className="flex items-center justify-center rounded-lg w-7 h-7 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shrink-0">
                      <span className="text-xs font-bold text-white">ig</span>
                    </div>
                    <span className="flex-1 text-sm font-medium text-pink-700">Instagram</span>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  </a>
                )}
                {socialMedia.twitter && (
                  <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-sky-50 border border-sky-100 hover:bg-sky-100 transition-colors">
                    <div className="flex items-center justify-center bg-black rounded-lg w-7 h-7 shrink-0">
                      <span className="text-xs font-bold text-white">𝕏</span>
                    </div>
                    <span className="flex-1 text-sm font-medium text-sky-700">X / Twitter</span>
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  </a>
                )}
                {socialMedia.youtube && (
                  <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                    <div className="flex items-center justify-center bg-red-600 rounded-lg w-7 h-7 shrink-0">
                      <span className="text-xs font-bold text-white">▶</span>
                    </div>
                    <span className="flex-1 text-sm font-medium text-red-700">YouTube</span>
                    <ChevronRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}

          {!params.company && !params.business_description && hobbies.length === 0 && !socialMedia && !subsStart && (
            <div className="py-12 text-center bg-white border border-border rounded-2xl text-muted-foreground">
              <Users className="mx-auto mb-3 w-9 h-9 opacity-20" />
              <p className="text-sm font-semibold">No additional info</p>
            </div>
          )}
        </div>
      )}

      {/* ── Threads tab ── */}
      {activeTab === 'threads' && (
        <div className="overflow-hidden bg-white border shadow-sm border-border rounded-2xl">
          {threads.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <FileText className="mx-auto mb-3 w-9 h-9 opacity-20" />
              <p className="text-sm font-semibold">No threads yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {threads.map(t => (
                <button key={t.id} onClick={() => onSelectThread(t)}
                  className="flex items-start w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/20 active:bg-muted/30 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      {!!t.is_hot && <Flame className="w-3 h-3 text-orange-400 shrink-0" />}
                      {t.tag && <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary">{t.tag}</span>}
                    </div>
                    <p className="text-sm font-semibold leading-snug transition-colors text-foreground group-hover:text-primary line-clamp-2">{t.title}</p>
                    <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-muted-foreground flex-wrap">
                      {t.board_name && <span className="font-medium text-primary/70">{t.board_name}</span>}
                      {t.board_name && <span>·</span>}
                      <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3" />{formatCount(t.vote_count ?? 0)}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{formatCount(t.reply_count ?? 0)}</span>
                      <span title={formatDate(t.created_at)}>{timeAgo(t.created_at)}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary/50 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Replies tab ── */}
      {activeTab === 'replies' && (
        <div className="space-y-2">
          {recentPosts.length === 0 ? (
            <div className="py-16 text-center bg-white border border-border rounded-2xl text-muted-foreground">
              <MessageCircle className="mx-auto mb-3 w-9 h-9 opacity-20" />
              <p className="text-sm font-semibold">No replies yet</p>
            </div>
          ) : (
            recentPosts.map(p => (
              <div key={p.id} className="overflow-hidden bg-white border shadow-sm border-border rounded-2xl">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/60">
                  <MessageSquare className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-xs truncate text-muted-foreground">
                    in{' '}
                    <button
                      onClick={() => p.thread_slug && onSelectThread({ slug: p.thread_slug, title: p.thread_title })}
                      className="font-semibold transition-colors text-primary hover:underline">
                      {p.thread_title ?? 'Thread'}
                    </button>
                  </span>
                  <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(p.created_at)}</span>
                </div>
                <div className="px-4 py-3">
                  <RichBody text={p.body} />
                </div>
                <div className="flex items-center gap-3 px-4 py-2 border-t border-border/40 bg-muted/10">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ChevronUp className="w-3 h-3" />{formatCount(p.vote_count ?? 0)} votes
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Photos tab ── */}
      {activeTab === 'photos' && (
        <div className="overflow-hidden bg-white border border-border rounded-2xl">
          <div className="grid grid-cols-3 gap-0.5">
            {contentPhotos.map(photo => (
              <div key={photo.id} className="overflow-hidden aspect-square bg-muted">
                <img
                  src={`${STORAGE_URL}${photo.upload_url}`}
                  alt=""
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bucket list tab ── */}
      {activeTab === 'bucket' && (
        <div className="space-y-2">
          {bucketList.map((item, i) => (
            <div key={i} className="flex gap-3 p-4 bg-white border border-border rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-bold text-primary">{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{item.destination}</p>
                {item.description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Videos tab ── */}
      {activeTab === 'videos' && (
        <div className="space-y-3">
          {youtubeVids.map((url, i) => {
            const vid = getYouTubeId(url);
            if (!vid) return null;
            return (
              <div key={i} className="overflow-hidden bg-white border border-border rounded-2xl">
                <div className="aspect-video">
                  <iframe src={`https://www.youtube.com/embed/${vid}`} className="w-full h-full" allowFullScreen title={`Video ${i + 1}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
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
    try { const res=await forumApi.toggleForum(token,!enabled); setEnabled(res.data.forum_enabled); toast(res.data.message,'success'); }
    catch(e) { toast(e.response?.data?.message??e.message,'error'); }
    finally { setSaving(false); }
  };

  return (
    <BottomSheet open onClose={onClose} title="Admin Panel">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-2xl border-border bg-muted/20">
          <div><p className="font-bold text-foreground">Forum Feature</p><p className="text-sm text-muted-foreground mt-0.5">{enabled?'Forum is live':'Showing Coming Soon page'}</p></div>
          <button onClick={toggle} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all disabled:opacity-60 active:scale-95" style={{background:enabled?'var(--color-primary,#6366f1)':'#3f3f46',color:'#fff'}}>
            {saving?<Spinner size="sm"/>:enabled?<ToggleRight className="w-5 h-5"/>:<ToggleLeft className="w-5 h-5"/>}
            {saving?'Saving...':enabled?'Enabled':'Disabled'}
          </button>
        </div>
        <div className={`flex items-center gap-3 p-3.5 rounded-2xl text-sm border ${enabled?'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${enabled?'bg-emerald-400':'bg-amber-400'}`}/>
          {enabled?'All boards and threads are accessible.':'Forum is hidden — users see Coming Soon.'}
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-sm bg-primary text-white hover:opacity-90 active:scale-[0.98] transition-all">Done</button>
      </div>
    </BottomSheet>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMING SOON
// ═══════════════════════════════════════════════════════════════
const ComingSoonPage = ({ onAdminOpen }) => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8"><Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-primary animate-pulse"/></div>
        <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-6xl md:text-7xl text-foreground">
          <span className="text-transparent bg-gradient-to-r from-primary via-primary to-accent bg-clip-text coming_label_id">Coming</span>
          <br/><span className="text-foreground soon_label_id">Soon</span>
        </h1>
      </div>
      <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2"><p className="text-sm text-center text-muted-foreground coming_soon_all_rights_reserved">© 2024 Coming Soon. All rights reserved.</p></div>
    </div>
    <button onClick={onAdminOpen} className="fixed z-40 p-3 transition-colors border rounded-full shadow-lg bottom-6 right-6 bg-muted/60 border-border hover:bg-muted" title="Admin"><Shield className="w-4 h-4 text-muted-foreground"/></button>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// FORUM PAGE  — root view router + header
// ═══════════════════════════════════════════════════════════════
const ForumPage = ({ onAdminOpen, token, toast }) => {
  const auth_states = useSelector(state => state.AuthReducer);
  const currentUser = auth_states?.StateUserInformation ?? { id: null, first_name: 'Guest', role: 'guest' };

  // ── View state ───────────────────────────────────────────────
  const [view, setView]                         = useState('home');
  const [selectedBoard, setSelectedBoard]       = useState(null);
  const [selectedThread, setSelectedThread]     = useState(null);
  const [selectedUser, setSelectedUser]         = useState(null);
  // Where to return to when leaving the people search flow
  const [preUserSnap, setPreUserSnap]           = useState({ view: 'home', board: null, thread: null });

  const [searchQuery, setSearchQuery]           = useState('');
  const [showNewThread, setShowNewThread]       = useState(false);
  const [newThreadLoading, setNewThreadLoading] = useState(false);
  const [getLoadingSelect, setGetLoadingSelect] = useState(false);
  const [searchOpen, setSearchOpen]             = useState(false);

  useEffect(() => {
    const ping = () => forumApi.sendHeartbeat(token).catch(() => {});
    ping();
    const id = setInterval(ping, 60_000);
    return () => clearInterval(id);
  }, [token]);

  // ── Navigation helpers ───────────────────────────────────────
  const selectBoard = b => { setSelectedBoard(b); setView('board'); setSearchQuery(''); setSearchOpen(false); };
  const selectThread = t => { setSelectedThread(t); setView('thread'); };

  const goBack = target => {
    if (target === 'home')  { setView('home');  setSelectedBoard(null); setSelectedThread(null); }
    if (target === 'board') { setView('board'); setSelectedThread(null); }
    // User search / profile navigation
    if (target === 'users') { setView('users'); setSelectedUser(null); }
    if (target === 'prev')  {
      // Return to wherever the user was before entering the people search flow
      setView(preUserSnap.view);
      setSelectedBoard(preUserSnap.board);
      setSelectedThread(preUserSnap.thread);
      setSelectedUser(null);
    }
  };

  /** Open the people search, saving the current location so we can return */
  const openUserSearch = () => {
    setPreUserSnap({ view, board: selectedBoard, thread: selectedThread });
    setView('users');
    setSearchOpen(false);
    setSearchQuery('');
  };

  /** Navigate from user-search results to a user's profile */
  const selectUser = user => {
    setSelectedUser(user);
    setView('user-profile');
  };

  /** Navigate to a user profile from clicking an author name inside any view */
  const viewUserProfile = (userId, seed = {}) => {
    setPreUserSnap({ view, board: selectedBoard, thread: selectedThread });
    setSelectedUser({ id: userId, ...seed });
    setView('user-profile');
  };

  const createThread = async ({ title, body, tag }) => {
    setNewThreadLoading(true);
    try {
      const res = await forumApi.createThread(token, { forum_board_id: selectedBoard.id, title, body, tag: tag || undefined });
      toast('Thread posted!', 'success');
      setShowNewThread(false);
      setSelectedThread(res.data.thread);
      setView('thread');
    } catch (e) { toast(e.response?.data?.message ?? e.message, 'error'); }
    finally { setNewThreadLoading(false); }
  };

  const selectTrendingThread = async t => {
    setGetLoadingSelect(true);
    try {
      const res = await forumApi.getThread(token, t.slug);
      setSelectedBoard({ id: res.data.thread?.forum_board_id, name: res.data.thread?.board, slug: res.data.thread?.board_slug });
      setSelectedThread(res.data.thread);
      setView('thread');
    } catch (e) { toast(e.response?.data?.message ?? e.message, 'error'); }
    finally { setGetLoadingSelect(false); }
  };

  const isAdmin = auth_states?.StateUserInformation?.accounts_table?.user_type_table?.user_type_is_admin;

  // Derived helpers for header display
  const isUserFlow    = view === 'users' || view === 'user-profile';
  const headerTitle   = view === 'board'        ? selectedBoard?.name
                      : view === 'thread'       ? selectedThread?.title
                      : view === 'users'        ? 'Find People'
                      : view === 'user-profile' ? ([selectedUser?.first_name, selectedUser?.last_name].filter(Boolean).join(' ') || 'Profile')
                      : '';
  const headerSubtitle = view === 'thread'       ? selectedBoard?.name
                       : view === 'user-profile' ? (selectedUser?.account_number ? `@${selectedUser.account_number}` : null)
                       : null;

  const handleHeaderBack = () => {
    if (view === 'thread')       goBack('board');
    else if (view === 'board')   goBack('home');
    else if (view === 'user-profile') goBack('users');
    else if (view === 'users')   goBack('prev');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky header ─────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex items-center gap-2 h-14">
            {/* Back / Logo */}
            {view !== 'home'
              ? <button onClick={handleHeaderBack}
                  className="p-2 -ml-2 transition-colors rounded-xl hover:bg-muted active:scale-95">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              : <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: 'var(--color-primary,#6366f1)' }}>
                    <Hash className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base font-black text-foreground sm:text-lg" style={{ fontFamily: "'Sora',sans-serif", letterSpacing: '-0.03em' }}>
                    ClubTEN Forum
                  </span>
                </div>
            }

            {/* Contextual title */}
            {view !== 'home' && (
              <div className="flex-1 min-w-0 mx-1">
                <p className="text-sm font-bold truncate text-foreground">{headerTitle}</p>
                {headerSubtitle && <p className="text-[11px] text-muted-foreground truncate">{headerSubtitle}</p>}
              </div>
            )}
            {view === 'home' && <div className="flex-1" />}

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Board search (home only) */}
              {view === 'home' && (
                <button onClick={() => setSearchOpen(v => !v)}
                  className={`p-2 rounded-xl transition-colors active:scale-95 ${searchOpen ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}>
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* New thread (board view, desktop) */}
              {view === 'board' && selectedBoard && !selectedBoard.is_locked && (
                <button onClick={() => setShowNewThread(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-white hover:opacity-90 active:scale-95 transition-all">
                  <Plus className="w-3.5 h-3.5" />New Thread
                </button>
              )}

              {/* ── People search button ──────────────────── */}
              <button
                onClick={isUserFlow ? handleHeaderBack : openUserSearch}
                title="Find people"
                className={`p-2 rounded-xl transition-colors active:scale-95
                ${isUserFlow
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-muted-foreground'}`}>
                <Users className="w-4 h-4" />
              </button>

              {/* Current user chip */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border border-border bg-muted/20">
                <button
                  onClick={() => viewUserProfile(currentUser?.id, { first_name: currentUser?.first_name, last_name: currentUser?.last_name })}
                  title="Your profile"
                  className="focus:outline-none">
                  <Avatar name={currentUser?.first_name || '?'} size="xs" className="transition-all hover:ring-2 hover:ring-primary/40" />
                </button>
                <span className="hidden sm:block text-xs font-semibold text-foreground max-w-[80px] truncate">
                  {currentUser?.first_name || 'Guest'}
                </span>
              </div>

              {isAdmin && (
                <button onClick={onAdminOpen} className="p-2 transition-colors rounded-xl hover:bg-muted active:scale-95 text-muted-foreground">
                  <Shield className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Board search bar */}
          {searchOpen && view === 'home' && (
            <div className="pb-3">
              <div className="relative">
                <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search boards..." autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  style={{ fontSize: 16 }} />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute p-1 -translate-y-1/2 rounded-lg right-3 top-1/2 hover:bg-muted"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {showNewThread && selectedBoard && (
        <NewThreadModal board={selectedBoard} onClose={() => setShowNewThread(false)} onSubmit={createThread} loading={newThreadLoading} token={token} />
      )}

      {/* ── Main content ─────────────────────────────── */}
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 sm:py-6">
        <div className="flex gap-6">
          <main className="flex-1 min-w-0">
            {/* Home */}
            {view === 'home' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-black sm:text-2xl text-foreground" style={{ fontFamily: "'Sora',sans-serif", letterSpacing: '-0.03em' }}>
                    Community Forums
                  </h1>
                </div>
                <HomeView searchQuery={searchQuery} onSelectBoard={selectBoard} token={token} />
              </>
            )}

            {/* Board */}
            {view === 'board' && selectedBoard && (
              <BoardView
                board={selectedBoard}
                onBack={() => goBack('home')}
                onSelectThread={selectThread}
                onNewThread={() => setShowNewThread(true)}
                onViewProfile={viewUserProfile}
                token={token}
              />
            )}

            {/* Thread */}
            {view === 'thread' && selectedThread && selectedBoard && (
              getLoadingSelect
                ? <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
                : <ThreadView
                    thread={selectedThread}
                    board={selectedBoard}
                    onBack={goBack}
                    currentUser={currentUser}
                    token={token}
                    toast={toast}
                    onViewProfile={viewUserProfile}
                  />
            )}

            {/* ── People search ── */}
            {view === 'users' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-black sm:text-2xl text-foreground" style={{ fontFamily: "'Sora',sans-serif", letterSpacing: '-0.03em' }}>
                    Find People
                  </h1>
                </div>
                <UserSearchView onSelectUser={selectUser} token={token} />
              </>
            )}

            {/* ── User profile ── */}
            {view === 'user-profile' && selectedUser && (
              <UserProfileView
                userId={selectedUser.id}
                userSeed={selectedUser}
                onSelectThread={selectTrendingThread}
                token={token}
                currentUser={currentUser}
              />
            )}
          </main>

          {/* Trending sidebar (desktop, hidden on people views) */}
          {!isUserFlow && (
            <div className="hidden w-64 xl:block shrink-0">
              <TrendingSidebar onSelectThread={selectTrendingThread} token={token} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
const MallSocial = () => {
  const auth_states = useSelector(state => state.AuthReducer);
  const token = auth_states.StateToken;

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false);
  const [getSelectedLanguage, setSelectedLanguage] = useState('');

  const [forumEnabled, setForumEnabled]   = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [adminOpen, setAdminOpen]         = useState(false);
  const { toasts, toast, removeToast }    = useToast();

  useEffect(() => {
    forumApi.getForumStatus().then(res => setForumEnabled(res.data.forum_enabled ?? false)).catch(() => {}).finally(() => setStatusLoading(false));
  }, []);

  useEffect(() => {
    auth_states.PageLanguages?.map(item => {
      const tr = item.translation;
      if (tr.length > 0 && auth_states.SelectedLanguage) {
        const f = tr.find(t => t.language_id == auth_states.SelectedLanguage.id);
        const els = document.getElementsByClassName(item.page_config_id);
        if (els?.length > 0) Array.from(els).forEach(el => { el.textContent = f ? f.page_config_title : item.page_config_title; });
      }
    });
  }, [auth_states]);

  const TopCategories = () => (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
      {[
        { path: '/academy-index', match: 'academy',   icon: <RiGraduationCapLine />,       label: 'Learn',     cls: 'academy_label_id' },
        { path: '/grow',          match: 'grow',       icon: <PiPottedPlantBold />,          label: 'Grow',      cls: 'grow_label_id' },
        { path: '/travel',        match: 'travel',     icon: <MdOutlineAirplanemodeActive />, label: 'Travel',    cls: 'travel_label_id' },
        { path: '/earn',          match: 'earn',       icon: <LuCircleDollarSign />,         label: 'Earn',      cls: 'earn_label_id' },
        { path: '/social',        match: 'social',     icon: <BiLike />,                     label: 'Social',    cls: 'social_label_id' },
        { path: '/shop',          match: 'shop',       icon: <BiStore />,                    label: 'Shop',      cls: 'shop_label_id' },
        { path: '/lifestyle',     match: 'lifestyle',  icon: <IoFitnessOutline />,           label: 'Lifestyle', cls: 'lifestyle_label_id' },
      ].map(({ path, match, icon, label, cls }) => (
        <LinkDom key={path} to={path}
          className={`flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px]
          ${location.pathname.includes(match) ? 'bg-[#031956] text-white' : 'bg-gray-200 text-gray-500'}`}>
          <div className="mb-1 text-xl">{icon}</div>
          <span className={`text-[12px] md:text-[15px] ${cls}`}>{label}</span>
        </LinkDom>
      ))}
    </div>
  );

  return (
    <>
      <div className="mb-3">
        <Header
          handleLanguageVisibility={() => setOpenLanguageSelection(true)}
          onPressAction={() => setOpen(!open)}
          ActionState={open}
        />
      </div>
      <div className="flex justify-center my-5">
        <div className="md:w-[75%] w-[95%]">
          <TopCategories />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;900&display=swap');
        .line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}
        .line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        .scrollbar-hide::-webkit-scrollbar{display:none}
        @keyframes forum-slide-up{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .forum-slide-up{animation:forum-slide-up 0.22s cubic-bezier(0.32,0.72,0,1)}

        /* ── Quill editor skin overrides ── */
        .quill-wrapper .ql-toolbar{
          border:none!important;
          border-bottom:1px solid var(--color-border,#e4e4e7)!important;
          background:var(--color-muted,#f4f4f5)/20;
          padding:6px 8px!important;
          flex-wrap:wrap;
        }
        .quill-wrapper .ql-container{
          border:none!important;
          font-size:14px;
        }
        .quill-wrapper .ql-editor{
          min-height:var(--quill-min-height,140px);
          font-size:14px;
          line-height:1.6;
          padding:12px;
        }
        .quill-wrapper .ql-editor.ql-blank::before{
          color:var(--color-muted-foreground,#a1a1aa);
          font-style:normal;
        }
        .quill-content img,.ql-editor img{
          max-width:100%;height:auto;border-radius:12px;margin:8px 0;display:block;
        }
        .quill-content .ql-video,.ql-editor .ql-video{
          width:100%;max-width:100%;aspect-ratio:16/9;border-radius:12px;margin:8px 0;display:block;
        }
        .quill-content blockquote{
          border-left:4px solid color-mix(in srgb,var(--color-primary,#6366f1) 40%,transparent);
          padding:8px 12px;margin:8px 0;
          background:var(--color-muted,#f4f4f5)/25;
          border-radius:0 8px 8px 0;font-style:italic;font-size:13px;
          color:var(--color-muted-foreground,#a1a1aa);
        }
        .quill-content pre{
          background:var(--color-muted,#f4f4f5);padding:12px;
          border-radius:8px;font-size:12px;overflow-x:auto;
        }
      `}</style>

      <Toast toasts={toasts} remove={removeToast} />
      {adminOpen && <AdminPanel forumEnabled={forumEnabled} onClose={() => setAdminOpen(false)} token={token} toast={toast} />}

      {statusLoading
        ? <div className="flex items-center justify-center min-h-screen bg-background"><Spinner size="lg" /></div>
        : forumEnabled
          ? <ForumPage onAdminOpen={() => setAdminOpen(true)} token={token} toast={toast} />
          : <div className="flex items-center justify-center min-h-screen bg-background"><Spinner size="lg" /></div>
      }

      {getOpenLanguageSelection && (
        <LanguageBottomSheet
          selected={getSelectedLanguage}
          handleSelectContent={e => setSelectedLanguage(e)}
          handleClose={() => setOpenLanguageSelection(false)}
          DataContent={auth_states.Languages}
        />
      )}
    </>
  );
};

export default MallSocial;
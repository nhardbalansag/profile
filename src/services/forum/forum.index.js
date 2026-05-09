import axios from 'axios';

const env = import.meta.env;
const BaseAPIUrl = env.VITE_APP_BACKEND_API_URL;
const ForumAPI   = env.VITE_APP_BACKEND_API_URL + 'forum/';
const AdminAPI   = env.VITE_APP_BACKEND_API_URL + 'admin/forum/';

// ─────────────────────────────────────────────────────────────────
// FORUM STATUS  (public — no token needed)
// ─────────────────────────────────────────────────────────────────

export const getForumStatus = async () => {
    return await axios({
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        url: `${ForumAPI}status`,
    });
};

// ─────────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────────

export const toggleForum = async (token, enabled) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'POST',
        url: `${AdminAPI}toggle`,
        data: enabled !== undefined ? { enabled } : {},
    });
};

export const getForumSettings = async (token) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${AdminAPI}settings`,
    });
};

export const updateForumSetting = async (token, key, value) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'PUT',
        url: `${AdminAPI}settings/${key}`,
        data: { value },
    });
};

// ─────────────────────────────────────────────────────────────────
// STATS & TRENDING
// ─────────────────────────────────────────────────────────────────

export const getForumStats = async (token) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${ForumAPI}stats`,
    });
};

export const getTrending = async (token, days = 7, limit = 10) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${ForumAPI}trending`,
        params: { days, limit },
    });
};

// ─────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────

export const getCategories = async (token) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${ForumAPI}categories`,
    });
};

export const getCategory = async (token, slug) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${ForumAPI}categories/${slug}`,
    });
};

// ─────────────────────────────────────────────────────────────────
// BOARDS
// ─────────────────────────────────────────────────────────────────

// params: { page, per_page, sort, search, tag }
export const getBoard = async (token, slug, params = {}) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${ForumAPI}boards/${slug}`,
        params,
    });
};

// ─────────────────────────────────────────────────────────────────
// THREADS
// ─────────────────────────────────────────────────────────────────

// params: { board, sort, tag, search, page, per_page }
export const getThreads = async (token, params = {}) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${ForumAPI}threads`,
        params,
    });
};

// params: { page, per_page }
export const getThread = async (token, slug, params = {}) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${ForumAPI}threads/${slug}`,
        params,
    });
};

// body: { forum_board_id, title, body, tag }
export const createThread = async (token, body) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'POST',
        url: `${ForumAPI}threads`,
        data: body,
    });
};

// body: { title?, body?, tag? }
export const updateThread = async (token, id, body) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'PUT',
        url: `${ForumAPI}threads/${id}`,
        data: body,
    });
};

export const deleteThread = async (token, id) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'DELETE',
        url: `${ForumAPI}threads/${id}`,
    });
};

// body: { value: 1 | -1 }
export const voteThread = async (token, id, value) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'POST',
        url: `${ForumAPI}threads/${id}/vote`,
        data: { value },
    });
};

export const bookmarkThread = async (token, id) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'POST',
        url: `${ForumAPI}threads/${id}/bookmark`,
        data: {},
    });
};

// ─────────────────────────────────────────────────────────────────
// POSTS  (replies)
// ─────────────────────────────────────────────────────────────────

// body: { body, parent_id? }
export const createPost = async (token, threadId, body) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'POST',
        url: `${ForumAPI}threads/${threadId}/posts`,
        data: body,
    });
};

export const updatePost = async (token, id, body) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'PUT',
        url: `${ForumAPI}posts/${id}`,
        data: { body },
    });
};

export const deletePost = async (token, id) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'DELETE',
        url: `${ForumAPI}posts/${id}`,
    });
};

// body: { value: 1 | -1 }
export const votePost = async (token, id, value) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'POST',
        url: `${ForumAPI}posts/${id}/vote`,
        data: { value },
    });
};

// ─────────────────────────────────────────────────────────────────
// HEARTBEAT  (online presence tracking)
// ─────────────────────────────────────────────────────────────────
// POST /forum/heartbeat
// Call this every 60s while the forum is open to keep online counts accurate.
// No body needed — the server uses the auth token to identify members vs guests.
export const sendHeartbeat = async (token) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'POST',
        url: `${ForumAPI}heartbeat`,
        data: {},
    });
};

// ─────────────────────────────────────────────────────────────────
// MEDIA UPLOAD
// ─────────────────────────────────────────────────────────────────
/**
 * POST /forum/media/upload
 * Accepts a single image or video file (multipart/form-data).
 * Returns: { success: true, url: "https://...", type: "image"|"video" }
 *
 * Used by the Quill editor image/video handlers.
 * Follows the same multipart pattern as UploadFile in your existing API files.
 */
export const uploadForumMedia = async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
 
    // Spread token headers but remove Content-Type so axios sets the
    // correct multipart boundary automatically (never hard-code it for FormData).
    const { 'Content-Type': _drop, ...tokenHeaders } = { ...token };
 
    return await axios({
        headers: { ...tokenHeaders },
        method: 'POST',
        url: `${ForumAPI}media/upload`,
        data: formData,
    });
};

// ─────────────────────────────────────────────────────────────────
// USER SEARCH & PROFILES
// ─────────────────────────────────────────────────────────────────

export const searchUsers = async (token, query) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${BaseAPIUrl}forum/users/search`,
        params: { q: query },
    });
};

export const getUserProfile = async (token, userId) => {
    return await axios({
        headers: { 'Content-Type': 'application/json', ...token },
        method: 'GET',
        url: `${BaseAPIUrl}forum/users/${userId}/profile`,
    });
};

/**
 * Pre-paint check for a stored docs-preview selection. The preview stores
 * (see preview-controls.tsx) clear their key on the default, so a present key
 * means the SSR'd previews show the wrong preset/mode. Inlined in the document
 * head — like the theme script — so the PreviewVeil covers previews before
 * first paint instead of flashing the wrong preset. Kept dependency-free: it
 * is imported by the root route and must not pull preview-controls into it.
 */
export const PREVIEW_PENDING_SCRIPT = `(function(){try{if(localStorage.getItem("dotui:preview-preset")||localStorage.getItem("dotui:preview-mode"))document.documentElement.setAttribute("data-preview-pending","")}catch(e){}})()`

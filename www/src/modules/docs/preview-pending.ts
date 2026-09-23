/**
 * Pre-paint check: do the SSR'd previews (Origin, in the site theme) show the
 * wrong system or mode for this reader? That is a picked system other than
 * Origin, a working studio system past pristine Origin when none is picked,
 * or a pinned mode other than the site theme — a pin equal to it is dropped
 * here. Inlined in the document head so the PreviewVeil covers previews
 * before first paint instead of flashing the wrong system. Kept
 * dependency-free: the root route imports it. Keys: preview-selection.ts,
 * preview-controls.tsx, studio/preset/storage.ts, and starter-themes' `theme`.
 */
export const PREVIEW_PENDING_SCRIPT = `(function(){try{var s=localStorage,m=s.getItem("dotui:preview-mode"),t=s.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(m===t){s.removeItem("dotui:preview-mode");m=null}var p=s.getItem("dotui:preview-preset"),w,q;if(!p||p==="yours"){w=s.getItem("dotui:preset");q=w?new URLSearchParams(w):null;p=q&&(q.get("preset")!=="origin"||q.has("d"))}else p=p!=="origin";if(m||p)document.documentElement.setAttribute("data-preview-pending","")}catch(e){}})()`

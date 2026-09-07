/**
 * A tiny event bus so the page HUD can drive the OS running on the laptop screen
 * without threading callbacks through Experience → Gym → Laptop → Desktop.
 *
 * Requests made before the OS has booted are held and delivered on subscribe,
 * so "open credits" from the start screen still lands once the desktop appears.
 */
type Handler = (appId: string) => void;

const handlers = new Set<Handler>();
let pending: string | null = null;

export const osBus = {
  openApp(appId: string) {
    if (handlers.size === 0) {
      pending = appId;
      return;
    }
    handlers.forEach((h) => h(appId));
  },
  subscribe(h: Handler) {
    handlers.add(h);
    if (pending) {
      const id = pending;
      pending = null;
      // Defer so the subscriber finishes mounting before it is asked to open a window.
      queueMicrotask(() => h(id));
    }
    return () => { handlers.delete(h); };
  },
};

import { useCallback, useRef, type ReactNode } from 'react';

export type WinState = {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

/**
 * The screen DOM is transformed in 3D by CSS3D, so a pointer delta in client pixels
 * is not the same as a delta in screen-DOM pixels. Measuring the transformed bounding
 * box gives us the exact ratio, whatever the camera happens to be doing.
 */
function domPxPerClientPx() {
  const el = document.getElementById('laptop-screen');
  if (!el) return 1;
  const r = el.getBoundingClientRect();
  if (!r.height) return 1;
  return 800 / r.height;
}

const SCREEN = { w: 1280, h: 800 };
const CHROME_TOP = 30;
const DOCK = 70;

type Props = {
  win: WinState;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
};

export default function Window({ win, children, onFocus, onClose, onMinimize, onToggleMax, onMove }: Props) {
  const drag = useRef<{ px: number; py: number; ox: number; oy: number; k: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Ignore drags that start on the traffic lights.
      if ((e.target as HTMLElement).closest('.os-lights')) return;
      onFocus();
      if (win.maximized) return;
      drag.current = { px: e.clientX, py: e.clientY, ox: win.x, oy: win.y, k: domPxPerClientPx() };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onFocus, win.x, win.y, win.maximized],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const nx = d.ox + (e.clientX - d.px) * d.k;
      const ny = d.oy + (e.clientY - d.py) * d.k;
      // Keep at least a strip of the title bar reachable.
      onMove(
        Math.max(-win.w + 90, Math.min(SCREEN.w - 90, nx)),
        Math.max(CHROME_TOP, Math.min(SCREEN.h - 46, ny)),
      );
    },
    [onMove, win.w],
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    drag.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* pointer already gone */ }
  }, []);

  const geom = win.maximized
    ? { left: 8, top: CHROME_TOP + 6, width: SCREEN.w - 16, height: SCREEN.h - CHROME_TOP - DOCK - 6 }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <div
      className={`os-win${win.minimized ? ' min' : ''}`}
      style={{ ...geom, zIndex: 100 + win.z }}
      onPointerDown={onFocus}
    >
      <div
        className="os-win-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={onToggleMax}
      >
        <div className="os-lights">
          <button className="os-light r" onClick={onClose} aria-label="Close"><span>×</span></button>
          <button className="os-light y" onClick={onMinimize} aria-label="Minimise"><span>−</span></button>
          <button className="os-light g" onClick={onToggleMax} aria-label="Maximise"><span>+</span></button>
        </div>
        <div className="os-win-title"><span className="ic">{win.icon}</span>{win.title}</div>
      </div>
      <div className="os-win-body">{children}</div>
    </div>
  );
}

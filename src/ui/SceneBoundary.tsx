import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * The 3D scene is the one part of this site that can fail for reasons outside our
 * control — no WebGL, a lost context, a driver that gives up. When it does, the page
 * should lose the room and keep the portfolio, not go blank.
 */
export default class SceneBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('3D scene failed; continuing without it.', error, info.componentStack);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

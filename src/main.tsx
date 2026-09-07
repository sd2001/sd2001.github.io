import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';

/**
 * Deliberately not wrapped in <React.StrictMode>.
 *
 * react-three-fiber v8 is not StrictMode-safe: the double-invoked layout effects tear
 * down and re-mount the Canvas, and on the second pass its Provider calls
 * events.connect(rootElement) with a detached (null) root — which throws and takes the
 * whole React root down with it, leaving the page rendered but inert.
 */
createRoot(document.getElementById('root')!).render(<App />);

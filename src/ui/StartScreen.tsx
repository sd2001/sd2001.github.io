import { profile } from '../data/content';

export default function StartScreen({ gone, ready, onStart }: { gone: boolean; ready: boolean; onStart: () => void }) {
  return (
    <div className={`start${gone ? ' gone' : ''}`}>
      <div>
        <div className="start-card">
          <div className="l1">{profile.name} — Portfolio 2026</div>
          <div className="l2">A gym you can walk into. Click start to begin.</div>
          <div className="meta">
            <b>{profile.role}</b> at <b>{profile.company}</b> · {profile.tagline}<br />
            Best on desktop with sound off and the lights down.
          </div>
          <button className="start-btn" onClick={onStart} disabled={!ready}>
            {ready ? 'START' : 'LOADING'}
          </button>
        </div>
        {!ready && <div className="start-warm">warming up the room…</div>}
      </div>
    </div>
  );
}

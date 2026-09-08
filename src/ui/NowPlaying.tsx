import { useEffect, useState } from 'react';
import { listenUrl, type Song } from '../data/content';

/**
 * The card that appears when you click the guitar. Sits on the left, near where the
 * guitar stands in the room, and auto-dismisses so it never becomes furniture.
 */
export default function NowPlaying({ song, playId }: { song: Song | null; playId: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!song) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 9000);
    return () => clearTimeout(t);
    // playId changes on every click, so clicking again restarts the timer and the animation.
  }, [song, playId]);

  if (!song) return null;

  return (
    <div className={`np${visible ? ' np-in' : ''}`} key={playId} aria-live="polite">
      <div className="np-art">
        {/* five bars, each on its own offset — a cheap but convincing equaliser */}
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} style={{ animationDelay: `${i * 0.13}s` }} />
        ))}
      </div>
      <div className="np-meta">
        <div className="np-kicker">♪ Now playing · guitar</div>
        <div className="np-title">{song.title}</div>
        <div className="np-artist">{song.artist}</div>
        {(song.album || song.year) && (
          <div className="np-album">
            {song.album}{song.album && song.year ? ' · ' : ''}{song.year}
          </div>
        )}
        {/* The strum you hear is synthesised; the real recording lives here. */}
        <a className="np-link" href={listenUrl(song)} target="_blank" rel="noreferrer">
          Listen to the real thing ↗
        </a>
      </div>
    </div>
  );
}

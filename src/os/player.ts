/**
 * Which track the guitar player should have selected.
 *
 * Clicking the guitar out in the room needs to reach the player app running inside the
 * laptop screen, and those two live in different React trees. This is the smallest thing
 * that connects them.
 */
type Handler = (index: number) => void;

const handlers = new Set<Handler>();
let current = 0;

export const player = {
  get index() {
    return current;
  },
  select(index: number) {
    current = index;
    handlers.forEach((h) => h(index));
  },
  /** Advance to the next track and return the new index. */
  next(total: number) {
    const i = total > 0 ? (current + 1) % total : 0;
    this.select(i);
    return i;
  },
  subscribe(h: Handler) {
    handlers.add(h);
    return () => {
      handlers.delete(h);
    };
  },
};

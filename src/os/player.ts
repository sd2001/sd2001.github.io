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
/** False until the guitar has been clicked once. */
let touched = false;

export const player = {
  get index() {
    return current;
  },
  select(index: number) {
    current = index;
    touched = true;
    handlers.forEach((h) => h(index));
  },
  /**
   * What a guitar click does. The first click plays the default track rather than
   * advancing past it, so the song at the top of the list is the one you actually hear
   * first. Every click after that moves along.
   */
  advance(total: number) {
    if (!touched) {
      this.select(current);
      return current;
    }
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

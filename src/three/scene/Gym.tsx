import type { Theme } from '../theme';
import Room, { ROOM } from './Room';
import Desk from './Desk';
import { DumbbellRack, FlatBench, LeaningPlates, SquatRack } from './Equipment';
import { Dog, Guitar, NeonSign } from './Props';
import Laptop from './Laptop';

const hd = ROOM.d / 2;

type Props = {
  theme: Theme;
  laptopActive: boolean;
  onRequestZoom: () => void;
  shadows: boolean;
  /** Phones paint the screen instead of mounting the desktop into CSS3D. */
  liveScreen: boolean;
  /** True once the camera has been sent to the screen. */
  atScreen: boolean;
};

/**
 * A small room, laid out for one fixed camera. Everything is placed to read from the
 * establishing shot; nothing is here "for when you walk over there", because you cannot.
 */
export default function Gym({ theme, laptopActive, onRequestZoom, shadows, liveScreen, atScreen }: Props) {
  return (
    <group>
      <Room theme={theme} shadows={shadows} />

      {/* ---- hero: the desk, the laptop, and a bench for a chair ---- */}
      <Desk theme={theme} />
      <Laptop
        theme={theme}
        active={laptopActive}
        onRequestZoom={onRequestZoom}
        liveScreen={liveScreen}
        hint={liveScreen}
        hintHidden={atScreen}
      />
      <group position={[0, 0, 0.62]} rotation={[0, Math.PI / 2, 0]}>
        <FlatBench theme={theme} />
      </group>

      {/* ---- gym kit, close in so the small room stays full ---- */}
      <group position={[2.9, 0, -2.3]} rotation={[0, -0.34, 0]}>
        <SquatRack theme={theme} />
      </group>
      <group position={[-2.75, 0, -2.0]} rotation={[0, 0.38, 0]}>
        <DumbbellRack theme={theme} />
      </group>
      <group position={[1.05, 0, -hd + 0.35]} rotation={[0, 0.1, 0]}>
        <LeaningPlates theme={theme} />
      </group>

      {/* ---- personal corners ---- */}
      <group position={[-2.2, 0, -0.25]} rotation={[0, 0.58, 0]}>
        <Guitar theme={theme} />
      </group>
      <group position={[2.05, 0, 0.05]} rotation={[0, -0.7, 0]}>
        <Dog theme={theme} />
      </group>

      {/* ---- wall ---- */}
      <group position={[1.35, 2.12, -hd + 0.05]}>
        <NeonSign theme={theme} />
      </group>
    </group>
  );
}

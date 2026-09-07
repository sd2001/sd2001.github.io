import type { Theme } from '../theme';
import Room, { ROOM } from './Room';
import {
  ChestPress, DumbbellRack, FlatBench, Kettlebells, LeaningPlates, PlateTree, PowerRack, Recovery, Odds,
} from './Equipment';
import { Dog, Guitar, GymBag, NeonSign, SplitBoard, WallClock, WallFan } from './Props';
import Laptop from './Laptop';

const halfW = ROOM.w / 2;
const halfD = ROOM.d / 2;

type Props = {
  theme: Theme;
  laptopActive: boolean;
  onRequestZoom: () => void;
};

/**
 * The whole room, laid out. The chest press sits at the origin facing +Z and everything
 * else is arranged around it to keep the establishing shot readable — heavy equipment on
 * the back wall, personal things (guitar, dog) in the near corners where the eye lands last.
 */
export default function Gym({ theme, laptopActive, onRequestZoom }: Props) {
  return (
    <group>
      <Room theme={theme} />

      {/* ---------------- HERO ---------------- */}
      <ChestPress theme={theme} />
      <Laptop theme={theme} active={laptopActive} onRequestZoom={onRequestZoom} />

      {/* things immediately around the machine */}
      <group position={[0.78, 0, 0.9]} rotation={[0, -0.4, 0]}>
        <Odds theme={theme} />
      </group>
      <group position={[1.35, 0, 1.45]} rotation={[0, 0.9, 0]}>
        <GymBag theme={theme} />
      </group>

      {/* ---------------- HEAVY EQUIPMENT, BACK WALL ---------------- */}
      <group position={[-3.7, 0, -3.5]} rotation={[0, 0.18, 0]}>
        <PowerRack theme={theme} />
      </group>
      <group position={[3.85, 0, -4.0]} rotation={[0, -0.16, 0]}>
        <DumbbellRack theme={theme} />
      </group>
      <group position={[-5.9, 0, -1.2]} rotation={[0, 0.7, 0]}>
        <PlateTree theme={theme} />
      </group>
      <group position={[6.1, 0, -1.4]} rotation={[0, -0.6, 0]}>
        <PlateTree theme={theme} />
      </group>
      <group position={[-1.9, 0, -5.15]}>
        <LeaningPlates theme={theme} />
      </group>

      {/* ---------------- MID GROUND ---------------- */}
      <group position={[-4.55, 0, 1.15]} rotation={[0, 0.5, 0]}>
        <FlatBench theme={theme} />
      </group>
      <group position={[2.55, 0, 1.9]} rotation={[0, -0.5, 0]}>
        <Kettlebells theme={theme} />
      </group>
      <group position={[-5.9, 0, 3.4]} rotation={[0, 0.25, 0]}>
        <Recovery theme={theme} />
      </group>

      {/* ---------------- PERSONAL CORNERS ---------------- */}
      {/* Guitar + amp, deliberately in the establishing shot rather than tucked in a
          corner — it should read alongside the gym and the Arsenal banner. */}
      <group position={[-2.45, 0, 2.35]} rotation={[0, 0.62, 0]}>
        <Guitar theme={theme} />
      </group>
      {/* the dog, near the right wall in a pool of lamp light */}
      <group position={[5.4, 0, 2.4]} rotation={[0, -0.5, 0]}>
        <Dog theme={theme} />
      </group>

      {/* ---------------- WALL FURNITURE ---------------- */}
      <group position={[-3.6, 2.35, -halfD + 0.1]}>
        <NeonSign theme={theme} />
      </group>
      <group position={[0.2, 3.05, -halfD + 0.12]}>
        <WallClock theme={theme} />
      </group>
      <group position={[halfW - 0.12, 1.95, 1.4]} rotation={[0, -Math.PI / 2, 0]}>
        <SplitBoard theme={theme} />
      </group>
      <group position={[-6.9, 3.3, -halfD + 0.2]} rotation={[0, 0.35, 0]}>
        <WallFan theme={theme} />
      </group>
    </group>
  );
}

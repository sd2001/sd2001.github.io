import { useEffect, useState } from 'react';

export type DeviceTier = 'phone' | 'tablet' | 'desktop';

export type Device = {
  tier: DeviceTier;
  /** Phones get a native scrolling layout instead of the 3D laptop screen. */
  isPhone: boolean;
  isTouch: boolean;
  width: number;
  height: number;
  landscape: boolean;
};

function read(): Device {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const landscape = width > height;

  // The deciding factor is whether a 1280x800 screen rendered inside the scene could
  // ever be legible. Below roughly 820 CSS px of width it cannot, whatever the device.
  let tier: DeviceTier = 'desktop';
  if (width < 820 || (isTouch && !landscape)) tier = 'phone';
  else if (width < 1180 || isTouch) tier = 'tablet';

  return { tier, isPhone: tier === 'phone', isTouch, width, height, landscape };
}

export function useDevice(): Device {
  const [device, setDevice] = useState<Device>(() =>
    typeof window === 'undefined'
      ? { tier: 'desktop', isPhone: false, isTouch: false, width: 1440, height: 900, landscape: true }
      : read(),
  );

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setDevice(read()));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return device;
}

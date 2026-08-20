import { Center, Text3D } from "@react-three/drei";
import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import { state } from "../store";

const FONT_CONFIGS = {
  SixCaps: {
    size: 1.45,
    mobileSize: 0.85,
    letterSpacing: 0.015,
    bevelThickness: 0.02,
  },
  Morganite_Medium: {
    size: 1.2,
    mobileSize: 0.7,
    letterSpacing: -0.005,
    bevelThickness: 0.02,
  },
  Teko_Bold: {
    size: 1.35,
    mobileSize: 0.8,
    letterSpacing: 0.01,
    bevelThickness: 0.02,
  },
  BebasNeue: {
    size: 1.15,
    mobileSize: 0.7,
    letterSpacing: 0.02,
    bevelThickness: 0.02,
  },
  Antonio_Bold: {
    size: 1.25,
    mobileSize: 0.75,
    letterSpacing: 0.01,
    bevelThickness: 0.02,
  },
  BarlowCondensed_Bold: {
    size: 1.15,
    mobileSize: 0.7,
    letterSpacing: 0.01,
    bevelThickness: 0.02,
  },
  SairaCondensed_Bold: {
    size: 1.15,
    mobileSize: 0.7,
    letterSpacing: 0.01,
    bevelThickness: 0.02,
  },
  Oswald_Bold: {
    size: 1.05,
    mobileSize: 0.65,
    letterSpacing: 0.01,
    bevelThickness: 0.02,
  },
  SF_Pro_Rounded_Bold: {
    size: 0.95,
    mobileSize: 0.55,
    letterSpacing: 0.01,
    bevelThickness: 0.02,
  },
};

export default function Clock() {
  const {
    isMobile,
    font = "SixCaps",
    heightScale = 0.85,
    cornerRoundness = 0.010,
  } = useSnapshot(state);

  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const config = FONT_CONFIGS[font] || FONT_CONFIGS.SixCaps;
  const fontPath = `/fonts/${font}.json`;

  const effectiveBevelSize = isMobile
    ? cornerRoundness * 0.75
    : cornerRoundness;

  return (
    <group scale={[1, heightScale, 1]}>
      <Center
        key={`${time}-${font}-${cornerRoundness.toFixed(3)}-${heightScale.toFixed(2)}`}
        position={[0, 0, 0]}
      >
        <Text3D
          size={isMobile ? config.mobileSize : config.size}
          letterSpacing={config.letterSpacing}
          height={0.08}
          bevelEnabled
          bevelSize={effectiveBevelSize}
          bevelSegments={10}
          curveSegments={16}
          bevelThickness={config.bevelThickness || 0.02}
          font={fontPath}
        >
          {time}
          <meshPhysicalMaterial
            color="white"
            roughness={0.23}
            transmission
            ior={1.8}
            thickness={2}
            reflectivity={0.4}
            clearcoat={0.2}
            clearcoatRoughness={0.1}
            iridescence={1}
            iridescenceIOR={0.9}
            iridescenceThicknessRange={[233, 434]}
            dispersion={12}
          />
        </Text3D>
      </Center>
    </group>
  );
}

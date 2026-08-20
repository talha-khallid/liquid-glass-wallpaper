import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Clock from "./components/Clock";
import BackgroundImageCover from "./components/BackgroundImageCover";
import DynamicLights from "./components/DynamicLights";
import * as THREE from "three";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import TopMenu from "./components/TopMenu";

function App() {
  return (
    <div className="main-container">
      <LoadingScreen />
      <TopMenu />
      <Canvas {...canvasProps}>
        <Suspense fallback={null}>
          <Clock />
          <Scene />
          <DynamicLights />
          <BackgroundImageCover />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;

const canvasProps = {
  gl: {
    antialias: true,
    powerPreference: "high-performance",
    toneMappingExposure: 1.5,
    stencil: false,
    alpha: false,
    toneMapping: THREE.NeutralToneMapping,
  },
  camera: { near: 0.01, far: 1000, fov: 5, position: [0, 0, 25] },
  dpr: [1, 1.5],
};

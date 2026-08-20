import { proxy } from "valtio";

const state = proxy({
  isMobile: window.innerWidth < 768,
  finishedLoadingAsset: false,
  background: "bg1",
  display: "clock",
  font: "SixCaps",
  heightScale: 0.85,
  cornerRoundness: 0.010,
});

export { state };

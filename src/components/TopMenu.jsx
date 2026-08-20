import React from "react";
import { useSnapshot } from "valtio";
import { state } from "../store";

const FONTS = [
  { id: "SixCaps", label: "Six Caps" },
  { id: "Morganite_Medium", label: "Morganite" },
  { id: "Teko_Bold", label: "Teko" },
  { id: "BebasNeue", label: "Bebas Neue" },
  { id: "Antonio_Bold", label: "Antonio" },
  { id: "BarlowCondensed_Bold", label: "Barlow" },
  { id: "SairaCondensed_Bold", label: "Saira" },
  { id: "Oswald_Bold", label: "Oswald" },
  { id: "SF_Pro_Rounded_Bold", label: "SF Pro" },
];

const BACKGROUNDS = [
  { id: "bg1", label: "1" },
  { id: "bg2", label: "2" },
  { id: "bg3", label: "3" },
];

export default function TopMenu() {
  const { font, heightScale = 0.85, background = "bg1" } = useSnapshot(state);

  return (
    <div className="top-right-hover-zone">
      <div className="top-settings-bar">
        {/* Font Select */}
        <div className="bar-item">
          <label className="bar-label">Font</label>
          <select
            className="bar-select"
            value={font}
            onChange={(e) => (state.font = e.target.value)}
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Height Slider */}
        <div className="bar-item">
          <label className="bar-label">
            Height {Math.round(heightScale * 100)}%
          </label>
          <input
            type="range"
            min="0.60"
            max="1.15"
            step="0.01"
            value={heightScale}
            onChange={(e) => (state.heightScale = parseFloat(e.target.value))}
            className="bar-slider"
          />
        </div>

        {/* Wallpaper */}
        <div className="bar-item">
          <label className="bar-label">BG</label>
          <div className="bar-bg-group">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                className={`bar-bg-btn ${background === bg.id ? "active" : ""}`}
                onClick={() => (state.background = bg.id)}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

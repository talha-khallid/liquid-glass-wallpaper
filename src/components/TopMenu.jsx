import React, { useState, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { state } from "../store";

const FONTS = [
  { id: "SixCaps", label: "Six Caps (Elongated)" },
  { id: "Morganite_Medium", label: "Morganite (Tall)" },
  { id: "Teko_Bold", label: "Teko (Geometric)" },
  { id: "BebasNeue", label: "Bebas Neue (Bold)" },
  { id: "Antonio_Bold", label: "Antonio (Clean)" },
  { id: "BarlowCondensed_Bold", label: "Barlow (Rounded Grotesque)" },
  { id: "SairaCondensed_Bold", label: "Saira (Display)" },
  { id: "Oswald_Bold", label: "Oswald (Modern)" },
  { id: "SF_Pro_Rounded_Bold", label: "SF Pro (Rounded)" },
];

const BACKGROUNDS = [
  { id: "bg1", label: "Gradient 1" },
  { id: "bg2", label: "Gradient 2" },
  { id: "bg3", label: "Gradient 3" },
];

export default function TopMenu() {
  const { font, heightScale = 0.85, background = "bg1" } = useSnapshot(state);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="top-menu-wrapper" ref={menuRef}>
      {/* Three dots button */}
      <button
        className={`three-dots-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2.2" />
          <circle cx="12" cy="12" r="2.2" />
          <circle cx="19" cy="12" r="2.2" />
        </svg>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="top-menu-popover">
          <div className="menu-header">
            <span>Clock Settings</span>
            <button className="close-menu-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Font Selector */}
          <div className="menu-section">
            <label className="section-label">Typeface</label>
            <div className="custom-select-wrapper">
              <select
                className="glass-select"
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
          </div>

          {/* Height Scale Slider */}
          <div className="menu-section">
            <div className="slider-label-row">
              <label className="section-label">Height</label>
              <span className="slider-value-text">
                {Math.round(heightScale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.60"
              max="1.15"
              step="0.01"
              value={heightScale}
              onChange={(e) => (state.heightScale = parseFloat(e.target.value))}
              className="glass-range-slider"
            />
          </div>

          {/* Wallpaper Selection */}
          <div className="menu-section">
            <label className="section-label">Wallpaper</label>
            <div className="wallpaper-pills">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  className={`wallpaper-btn ${background === bg.id ? "active" : ""}`}
                  onClick={() => (state.background = bg.id)}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

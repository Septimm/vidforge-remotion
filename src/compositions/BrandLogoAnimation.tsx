import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandLogoProps } from "../lib/types";

export const brandLogoDefaultProps: BrandLogoProps = {
  brand: {
    name: "MARQUE",
    logoUrl: "",
    primaryColor: "#FF6B2B",
    secondaryColor: "#FFFFFF",
  },
  tagline: "L'excellence en mouvement",
  backgroundColor: "#050505",
  logoAnimation: "reveal",
};

export const BrandLogoAnimation: React.FC<BrandLogoProps> = ({
  brand, tagline, backgroundColor, logoAnimation,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameScale = spring({ frame, fps, from: logoAnimation === "scale" ? 0.5 : 1, to: 1, config: { damping: 16, stiffness: 60 } });
  const nameOpacity = interpolate(frame, logoAnimation === "fade" ? [0, 40] : [10, 35], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [20, 55], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [55, 85], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [55, 85], [10, 0], { extrapolateRight: "clamp" });
  const globalOpacity = interpolate(frame, [95, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      backgroundColor, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", opacity: globalOpacity,
    }}>
      <div style={{ opacity: nameOpacity, transform: `scale(${nameScale})`, textAlign: "center" }}>
        <p style={{
          fontFamily: brand.fontFamily || "sans-serif",
          fontSize: 140, fontWeight: 900, color: "#FFFFFF",
          margin: 0, letterSpacing: "12px", textTransform: "uppercase", lineHeight: 1,
        }}>
          {brand.name}
        </p>
      </div>
      <div style={{ width: 800, height: 3, margin: "32px auto", display: "flex", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ width: `${lineWidth * 100}%`, height: "100%", backgroundColor: brand.primaryColor, borderRadius: 2 }} />
      </div>
      {tagline && (
        <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineY}px)`, textAlign: "center" }}>
          <p style={{
            fontFamily: brand.fontFamily || "sans-serif",
            fontSize: 36, fontWeight: 300, color: "rgba(255,255,255,0.65)",
            margin: 0, letterSpacing: "6px", textTransform: "uppercase",
          }}>
            {tagline}
          </p>
        </div>
      )}
      <div style={{
        position: "absolute", bottom: 80, right: 120,
        width: 10, height: 10, borderRadius: "50%",
        backgroundColor: brand.primaryColor, opacity: taglineOpacity,
      }} />
    </AbsoluteFill>
  );
};

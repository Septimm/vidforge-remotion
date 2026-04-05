
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HeroProps } from "../lib/types";

export const heroDefaultProps: HeroProps = {
  packshotUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
  brand: {
    name: "MARQUE",
    logoUrl: "",
    primaryColor: "#FF6B2B",
    secondaryColor: "#FFFFFF",
  },
  hookText: "Résultats visibles",
  benefitText: "La formule qui change tout",
  ctaText: "Découvrir maintenant",
  backgroundType: "dark",
  backgroundColor: "#080808",
  accentColor: "#FF6B2B",
  revealStyle: "rise",
  showPrice: false,
};

export const HeroProductReveal: React.FC<HeroProps> = ({
  packshotUrl, brand, hookText, benefitText, ctaText,
  backgroundType, backgroundColor, accentColor,
  revealStyle, showPrice, priceValue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const productY = spring({ frame, fps, from: revealStyle === "rise" ? 120 : 0, to: 0, config: { damping: 18, stiffness: 50, mass: 1.2 } });
  const productScale = spring({ frame, fps, from: revealStyle === "zoom" ? 0.6 : 1, to: 1, config: { damping: 14, stiffness: 55 } });
  const productOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const hookOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" });
  const hookX = interpolate(frame, [40, 65], [-30, 0], { extrapolateRight: "clamp" });
  const benefitOpacity = interpolate(frame, [60, 85], [0, 1], { extrapolateRight: "clamp" });
  const ctaOpacity = interpolate(frame, [90, 115], [0, 1], { extrapolateRight: "clamp" });
  const accentLineH = interpolate(frame, [30, 70], [0, 200], { extrapolateRight: "clamp" });

  const background = backgroundType === "gradient"
    ? `linear-gradient(180deg, #1a0a00 0%, ${backgroundColor} 60%)`
    : backgroundColor;

  return (
    <AbsoluteFill style={{ background }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: accentColor, opacity: ctaOpacity }} />
      <div style={{
        position: "absolute", top: "8%", left: "50%",
        transform: `translateX(-50%) translateY(${productY}px) scale(${productScale})`,
        opacity: productOpacity, width: 900, height: 900,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Img src={packshotUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", left: 80, top: "52%", width: 3, height: accentLineH, backgroundColor: accentColor, borderRadius: 2 }} />
      <div style={{ position: "absolute", bottom: "8%", left: 80, right: 80 }}>
        <p style={{
          fontFamily: brand.fontFamily || "sans-serif",
          fontSize: 72, fontWeight: 900, color: "#FFFFFF",
          margin: "0 0 20px", lineHeight: 1.05, letterSpacing: "-2px",
          textTransform: "uppercase", opacity: hookOpacity,
          transform: `translateX(${hookX}px)`,
        }}>{hookText}</p>
        <p style={{
          fontFamily: brand.fontFamily || "sans-serif",
          fontSize: 38, fontWeight: 400, color: "rgba(255,255,255,0.70)",
          margin: "0 0 48px", lineHeight: 1.3, opacity: benefitOpacity,
        }}>{benefitText}</p>
        <div style={{ opacity: ctaOpacity, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ backgroundColor: accentColor, paddingLeft: 48, paddingRight: 48, paddingTop: 24, paddingBottom: 24, borderRadius: 6 }}>
            <p style={{ fontFamily: brand.fontFamily || "sans-serif", fontSize: 32, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>{ctaText}</p>
          </div>
          {showPrice && priceValue && (
            <p style={{ fontFamily: brand.fontFamily || "sans-serif", fontSize: 48, fontWeight: 800, color: accentColor, margin: 0 }}>{priceValue}</p>
          )}
        </div>
        <p style={{
          fontFamily: brand.fontFamily || "sans-serif",
          fontSize: 26, fontWeight: 600, color: accentColor,
          margin: "40px 0 0", letterSpacing: "4px",
          textTransform: "uppercase", opacity: ctaOpacity,
        }}>{brand.name}</p>
      </div>
    </AbsoluteFill>
  );
};

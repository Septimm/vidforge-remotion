import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PackshotProps } from "../lib/types";

export const packShotDefaultProps: PackshotProps = {
  packshotUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
  brand: {
    name: "MARQUE",
    logoUrl: "",
    primaryColor: "#FF6B2B",
    secondaryColor: "#FFFFFF",
  },
  hookText: "La différence se voit",
  benefitText: "Formule premium concentrée",
  backgroundColor: "#0A0A0A",
  animationStyle: "scale",
  showPrice: false,
};

export const PackshotStudioPremium: React.FC<PackshotProps> = ({
  packshotUrl,
  brand,
  hookText,
  benefitText,
  backgroundColor,
  animationStyle,
  showPrice,
  priceValue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const productScale = spring({
    frame,
    fps,
    from: animationStyle === "scale" ? 0.7 : 1,
    to: 1,
    config: { damping: 14, stiffness: 60, mass: 1 },
  });

  const productOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const hookOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  const hookY = interpolate(frame, [25, 45], [12, 0], {
    extrapolateRight: "clamp",
  });

  const benefitOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const accentOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div style={{
        position: "absolute", left: 60, top: "20%",
        width: 3, height: "60%",
        backgroundColor: brand.primaryColor,
        opacity: accentOpacity, borderRadius: 2,
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${productScale})`,
        opacity: productOpacity, width: 680, height: 680,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Img src={packshotUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{
        position: "absolute", top: 80, left: 80, right: 80,
        opacity: hookOpacity, transform: `translateY(${hookY}px)`,
      }}>
        <p style={{
          fontFamily: brand.fontFamily || "sans-serif",
          fontSize: 52, fontWeight: 800, color: "#FFFFFF",
          margin: 0, lineHeight: 1.1, letterSpacing: "-1px",
          textTransform: "uppercase",
        }}>
          {hookText}
        </p>
      </div>
      <div style={{
        position: "absolute", bottom: 80, left: 80, right: 80,
        opacity: benefitOpacity,
      }}>
        <p style={{
          fontFamily: brand.fontFamily || "sans-serif",
          fontSize: 32, fontWeight: 400,
          color: "rgba(255,255,255,0.75)",
          margin: 0, letterSpacing: "0.5px",
        }}>
          {benefitText}
        </p>
        {showPrice && priceValue && (
          <p style={{
            fontFamily: brand.fontFamily || "sans-serif",
            fontSize: 44, fontWeight: 700,
            color: brand.primaryColor, margin: "12px 0 0",
          }}>
            {priceValue}
          </p>
        )}
      </div>
      <div style={{
        position: "absolute", bottom: 80, right: 80,
        opacity: accentOpacity,
      }}>
        <p style={{
          fontFamily: brand.fontFamily || "sans-serif",
          fontSize: 22, fontWeight: 600,
          color: brand.primaryColor, margin: 0,
          letterSpacing: "3px", textTransform: "uppercase",
        }}>
          {brand.name}
        </p>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const brandLogoDefaultProps = {
  brand: {
    name: "MARKEDZ",
    logoUrl: "",
    primaryColor: "#2D7A1F",
    secondaryColor: "#8DC63F",
  },
  tagline: "",
  backgroundColor: "#050505",
  logoAnimation: "reveal" as const,
};

export const BrandLogoAnimation: React.FC<typeof brandLogoDefaultProps> = ({
  brand,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cercle extérieur
  const ringScale = spring({
    frame,
    fps,
    from: 0.3,
    to: 1,
    config: { damping: 12, stiffness: 40 },
  });

  const ringOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bordure verte qui tourne
  const ringRotation = interpolate(frame, [0, 120], [0, 360], {
    extrapolateRight: "clamp",
  });

  // Logo central
  const logoScale = spring({
    frame: Math.max(0, frame - 15),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 50 },
  });

  const logoOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Nom de marque
  const nameOpacity = interpolate(frame, [45, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  const nameY = interpolate(frame, [45, 70], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Ligne accent
  const lineWidth = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Particules lumineuses
  const glowOpacity = interpolate(frame, [30, 60, 100, 120], [0, 0.6, 0.4, 0], {
    extrapolateRight: "clamp",
  });

  // Fade out final
  const globalOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const size = 280;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: globalOpacity,
      }}
    >
      {/* Glow ambiant */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.primaryColor}22 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* Cercle rotatif extérieur */}
      <div
        style={{
          position: "absolute",
          width: size + 60,
          height: size + 60,
          borderRadius: "50%",
          border: `3px solid ${brand.primaryColor}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale}) rotate(${ringRotation}deg)`,
          borderTopColor: brand.secondaryColor,
          borderRightColor: "transparent",
        }}
      />

      {/* Cercle statique intérieur */}
      <div
        style={{
          position: "absolute",
          width: size + 20,
          height: size + 20,
          borderRadius: "50%",
          border: `1px solid ${brand.primaryColor}44`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />

      {/* Container logo circulaire */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)`,
          border: `4px solid ${brand.primaryColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          boxShadow: `0 0 40px ${brand.primaryColor}44, inset 0 0 20px ${brand.primaryColor}11`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Fennec SVG stylisé */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 200 200"
          fill="none"
        >
          {/* Corps du fennec */}
          <ellipse cx="100" cy="130" rx="40" ry="30" fill={brand.primaryColor} />

          {/* Tête */}
          <circle cx="100" cy="95" r="28" fill={brand.primaryColor} />

          {/* Oreille gauche — grande */}
          <path
            d="M72 80 L50 30 L85 65 Z"
            fill={brand.primaryColor}
          />
          <path
            d="M72 80 L55 35 L82 68 Z"
            fill={brand.secondaryColor}
            opacity="0.6"
          />

          {/* Oreille droite — grande */}
          <path
            d="M128 80 L150 30 L115 65 Z"
            fill={brand.primaryColor}
          />
          <path
            d="M128 80 L145 35 L118 68 Z"
            fill={brand.secondaryColor}
            opacity="0.6"
          />

          {/* Yeux */}
          <circle cx="90" cy="92" r="5" fill="#FFFFFF" />
          <circle cx="110" cy="92" r="5" fill="#FFFFFF" />
          <circle cx="91" cy="93" r="3" fill="#0A0A0A" />
          <circle cx="111" cy="93" r="3" fill="#0A0A0A" />
          <circle cx="92" cy="91" r="1" fill="#FFFFFF" />
          <circle cx="112" cy="91" r="1" fill="#FFFFFF" />

          {/* Nez */}
          <ellipse cx="100" cy="103" rx="4" ry="3" fill="#0A0A0A" />

          {/* Museau blanc */}
          <ellipse cx="100" cy="108" rx="8" ry="5" fill="#F0F0E8" opacity="0.9" />

          {/* Pattes avant */}
          <ellipse cx="82" cy="158" rx="10" ry="6" fill={brand.secondaryColor} opacity="0.8" />
          <ellipse cx="118" cy="158" rx="10" ry="6" fill={brand.secondaryColor} opacity="0.8" />

          {/* Queue */}
          <path
            d="M140 135 Q170 120 165 100 Q160 90 150 95"
            stroke={brand.secondaryColor}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Nom MARKEDZ */}
      <div
        style={{
          marginTop: 48,
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          textAlign: "center",
        }}
      >
        {/* Ligne accent */}
        <div
          style={{
            width: `${lineWidth * 200}px`,
            height: 2,
            backgroundColor: brand.primaryColor,
            margin: "0 auto 20px",
            borderRadius: 1,
          }}
        />

        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: 56,
            fontWeight: 900,
            color: "#FFFFFF",
            margin: 0,
            letterSpacing: "8px",
            textTransform: "uppercase",
          }}
        >
          {brand.name.slice(0, 6)}
          <span style={{ color: brand.secondaryColor }}>
            {brand.name.slice(6)}
          </span>
        </p>

        {/* Ligne accent bas */}
        <div
          style={{
            width: `${lineWidth * 200}px`,
            height: 2,
            backgroundColor: brand.secondaryColor,
            margin: "16px auto 0",
            borderRadius: 1,
          }}
        />
      </div>

    </AbsoluteFill>
  );
};

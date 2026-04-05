import React from "react";
import { Composition } from "remotion";
import { PackshotStudioPremium, packShotDefaultProps } from "./compositions/PackshotStudioPremium";
import { HeroProductReveal, heroDefaultProps } from "./compositions/HeroProductReveal";
import { BrandLogoAnimation, brandLogoDefaultProps } from "./compositions/BrandLogoAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PackshotStudioPremium"
        component={PackshotStudioPremium}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={packShotDefaultProps}
      />
      <Composition
        id="HeroProductReveal"
        component={HeroProductReveal}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={heroDefaultProps}
      />
      <Composition
        id="BrandLogoAnimation"
        component={BrandLogoAnimation}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={brandLogoDefaultProps}
      />
    </>
  );
};

export interface BrandConfig {
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
}

export interface PackshotProps {
  packshotUrl: string;
  brand: BrandConfig;
  hookText: string;
  benefitText: string;
  backgroundColor: string;
  animationStyle: "fade" | "scale" | "slide";
  showPrice: boolean;
  priceValue?: string;
}

export interface HeroProps {
  packshotUrl: string;
  brand: BrandConfig;
  hookText: string;
  benefitText: string;
  ctaText: string;
  backgroundType: "dark" | "gradient" | "color";
  backgroundColor: string;
  accentColor: string;
  revealStyle: "rise" | "zoom" | "curtain";
  showPrice: boolean;
  priceValue?: string;
}

export interface BrandLogoProps {
  brand: BrandConfig;
  tagline?: string;
  backgroundColor: string;
  logoAnimation: "fade" | "scale" | "reveal";
}

export interface RenderRequest {
  compositionId: "PackshotStudioPremium" | "HeroProductReveal" | "BrandLogoAnimation";
  props: PackshotProps | HeroProps | BrandLogoProps;
}

export interface RenderResponse {
  success: boolean;
  renderId?: string;
  videoUrl?: string;
  error?: string;
}

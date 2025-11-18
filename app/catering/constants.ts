/**
 * Layout constants for the Catering page
 * These values are based on the 1920x1589 design canvas
 */
export const CATERING_LAYOUT = {
  // Vertical positioning
  HERO_TOP: "7.4%",
  FORM_TITLE_TOP: "45%",
  FORM_BOTTOM: "11%",
  
  // Horizontal positioning
  FORM_LEFT: "7.2%",
  
  // Form dimensions
  FORM_WIDTH: "36.979%", // 710/1920 = 36.979%
  FORM_GAP: "30px",
  INPUT_WIDTH_CALC: "calc(50% - 15px)",
  
  // Aspect ratios
  ASPECT_MOBILE: "750/669",
  ASPECT_DESKTOP: "1920/1589",
} as const;

/**
 * Responsive image sizing utilities for the news carousel
 * Implements the formulas specified in the design document
 */

/**
 * Calculate responsive image dimensions for desktop layout (≥768px)
 * Max dimensions: 600×340px at 1920px viewport
 * Formula: width = min(600, 600 * (viewport / 1920))
 * Formula: height = min(340, 340 * (viewport / 1920))
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Object with width and height properties
 */
export function getDesktopImageSize(viewportWidth: number): { width: number; height: number } {
    const maxWidth = 600;
    const maxHeight = 340;
    const maxViewport = 1920;

    const scale = Math.min(1, viewportWidth / maxViewport);
    const width = Math.floor(maxWidth * scale);
    const height = Math.floor(maxHeight * scale);

    return { width, height };
}

/**
 * Calculate responsive image dimensions for mobile layout (<768px)
 * Max dimensions: 690×340px at 768px viewport
 * Formula: width = min(690, 690 * (viewport / 768))
 * Formula: height = min(340, 340 * (viewport / 768))
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Object with width and height properties
 */
export function getMobileImageSize(viewportWidth: number): { width: number; height: number } {
    const maxWidth = 690;
    const maxHeight = 340;
    const maxViewport = 768;

    const scale = Math.min(1, viewportWidth / maxViewport);
    const width = Math.floor(maxWidth * scale);
    const height = Math.floor(maxHeight * scale);

    return { width, height };
}

/**
 * Calculate responsive font size for desktop title (≥768px)
 * Max font size: 24px at 1920px viewport
 * Formula: font-size = min(24, 24 * (viewport / 1920))px
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Font size in pixels
 */
export function getDesktopTitleFontSize(viewportWidth: number): number {
    const maxFontSize = 24;
    const maxViewport = 1920;

    const scale = Math.min(1, viewportWidth / maxViewport);
    return Math.floor(maxFontSize * scale);
}

/**
 * Calculate responsive font size for mobile title (<768px)
 * Max font size: 36px at 768px viewport
 * Formula: font-size = min(36, 36 * (viewport / 768))px
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Font size in pixels
 */
export function getMobileTitleFontSize(viewportWidth: number): number {
    const maxFontSize = 36;
    const maxViewport = 768;

    const scale = Math.min(1, viewportWidth / maxViewport);
    return Math.floor(maxFontSize * scale);
}

/**
 * Calculate responsive font size for desktop excerpt (≥768px)
 * Max font size: 18px at 768px viewport
 * Formula: font-size = min(18, 18 * (viewport / 768))px
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Font size in pixels
 */
export function getDesktopExcerptFontSize(viewportWidth: number): number {
    const maxFontSize = 18;
    const maxViewport = 768;

    const scale = Math.min(1, viewportWidth / maxViewport);
    return Math.floor(maxFontSize * scale);
}

/**
 * Calculate responsive font size for mobile excerpt (<768px)
 * Max font size: 30px at 768px viewport
 * Formula: font-size = min(30, 30 * (viewport / 768))px
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Font size in pixels
 */
export function getMobileExcerptFontSize(viewportWidth: number): number {
    const maxFontSize = 30;
    const maxViewport = 768;

    const scale = Math.min(1, viewportWidth / maxViewport);
    return Math.floor(maxFontSize * scale);
}
import {LOGO_PATHS} from "../logoPaths";
/** CSS mask-image: the official mark as an SVG data URI (used for the chevron reveal, vocab 11). */
export const logoMaskUri = (): string => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='black' d='${LOGO_PATHS.topChevron}'/><path fill='black' d='${LOGO_PATHS.diamond}'/><path fill='black' d='${LOGO_PATHS.bottomChevron}'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

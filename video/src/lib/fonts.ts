import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

/**
 * Brand fonts loaded once at module evaluation. The Space Grotesk
 * 600/700 weights drive headlines + the cracked-b lockup. Inter 400/500
 * for body text. JetBrains Mono for the URL pill in the browser frame.
 *
 * Remotion's `@remotion/google-fonts` package waits on these in the
 * render server before painting any frame, so the wordmark renders with
 * the actual Space Grotesk geometry rather than a fallback sans.
 */
loadSpaceGrotesk("normal", {
  weights: ["500", "600", "700"],
});
loadInter("normal", {
  weights: ["400", "500", "600"],
});
loadJetBrainsMono("normal", {
  weights: ["400", "500"],
});

/**
 * Brittle brand lockup. Cracked-b glyph + "brittle" wordmark with the
 * signature amber crack rect. Geometry copied 1:1 from the marketing
 * site's Logo.astro and the docs lockup SVG.
 */
export const Logo: React.FC<{ height?: number; mono?: boolean }> = ({
  height = 120,
  mono = false,
}) => {
  // Width = height * (380/90) to preserve the source aspect.
  const width = height * (380 / 90);
  const ink = mono ? "#f4f4f5" : "#f4f4f5";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 380 90"
      role="img"
      aria-label="Brittle"
    >
      {/* Glyph */}
      <svg
        x={0}
        y={0}
        width={101}
        height={90}
        viewBox="4 6 72 64"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="vid-lockup-glyph-upper">
            <rect x="0" y="0" width="80" height="38" />
          </clipPath>
          <clipPath id="vid-lockup-glyph-lower">
            <rect x="0" y="42" width="80" height="38" />
          </clipPath>
        </defs>
        <text
          x="40"
          y="58"
          textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="700"
          fontSize="64"
          letterSpacing="-3"
          fill={ink}
          clipPath="url(#vid-lockup-glyph-upper)"
        >
          b
        </text>
        <text
          x="43"
          y="58"
          textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="700"
          fontSize="64"
          letterSpacing="-3"
          fill={ink}
          clipPath="url(#vid-lockup-glyph-lower)"
        >
          b
        </text>
        <rect x="6" y="39" width="68" height="2" fill="#E8893B" />
      </svg>
      {/* Wordmark */}
      <svg
        x={115}
        y={0}
        width={260}
        height={90}
        viewBox="0 0 260 90"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="vid-lockup-word-upper">
            <rect x="-20" y="0" width="300" height="43" />
          </clipPath>
          <clipPath id="vid-lockup-word-lower">
            <rect x="-20" y="47" width="300" height="60" />
          </clipPath>
        </defs>
        <text
          x="0"
          y="69"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="700"
          fontSize="80"
          letterSpacing="-4"
          fill={ink}
          clipPath="url(#vid-lockup-word-upper)"
        >
          brittle
        </text>
        <text
          x="4"
          y="73"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="700"
          fontSize="80"
          letterSpacing="-4"
          fill={ink}
          clipPath="url(#vid-lockup-word-lower)"
        >
          brittle
        </text>
        <rect
          x="2"
          y="44"
          width="210"
          height="2"
          fill="#E8893B"
          transform="rotate(-1 107 45)"
        />
      </svg>
    </svg>
  );
};

import { site } from "@/config/site";
import { botswanaMap } from "@/content/botswana-map";
import { distanceFromBase, project, towns } from "@/content/coverage";

const { width, height } = botswanaMap.viewBox;

const graticule = {
  lons: [20, 22, 24, 26, 28],
  lats: [-18, -20, -22, -24, -26],
};

/** SVG map of Botswana: outline, graticule, Gaborone base and reference towns. */
export function CoverageMap() {
  const base = project(site.base.lon, site.base.lat);

  return (
    <div className="map relative" data-reveal="map">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Map of Botswana</title>
        <desc id="map-desc">
          Mayfair Construction’s base in Gaborone, with lines to reference towns across Botswana showing straight-line
          distance. Mayfair has one base; the towns are not branch locations.
        </desc>

        <g stroke="var(--color-sky)" strokeOpacity="0.14" strokeWidth="1" vectorEffect="non-scaling-stroke">
          {graticule.lons.map((lon) => {
            const a = project(lon, -17.5);
            const b = project(lon, -27);
            return <line key={lon} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />;
          })}
          {graticule.lats.map((lat) => {
            const a = project(19.6, lat);
            const b = project(29.6, lat);
            return <line key={lat} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />;
          })}
        </g>
        <g fill="var(--color-sky)" fillOpacity="0.5" fontFamily="var(--font-plex-mono)" fontSize="18" letterSpacing="1">
          {graticule.lons.map((lon) => {
            const p = project(lon, -17.5);
            return (
              <text key={lon} x={p.x + 6} y={p.y - 6}>
                {lon}°E
              </text>
            );
          })}
          {graticule.lats.map((lat) => {
            const p = project(19.6, lat);
            return (
              <text key={lat} x={p.x - 6} y={p.y - 6}>
                {Math.abs(lat)}°S
              </text>
            );
          })}
        </g>

        <path
          className="m-outline"
          d={botswanaMap.outline}
          pathLength={1}
          fill="rgb(127 178 224 / 0.07)"
          stroke="var(--color-sky)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {towns.map((t, i) => {
          const p = project(t.lon, t.lat);
          const mx = (base.x + p.x) / 2;
          const my = (base.y + p.y) / 2;
          const bend = 0.12;
          const cx = mx - (p.y - base.y) * bend;
          const cy = my + (p.x - base.x) * bend;
          return (
            <path
              key={t.name}
              className="m-route"
              d={`M${base.x} ${base.y} Q${cx} ${cy} ${p.x} ${p.y}`}
              pathLength={1}
              fill="none"
              stroke="var(--color-ochre)"
              strokeOpacity="0.55"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ "--i": i } as React.CSSProperties}
            />
          );
        })}

        {towns.map((t, i) => {
          const p = project(t.lon, t.lat);
          const left = t.labelSide === "left";
          const tx = left ? p.x - 14 : p.x + 14;
          return (
            <g key={t.name} className="m-town" style={{ "--i": i } as React.CSSProperties}>
              <circle cx={p.x} cy={p.y} r="5" fill="var(--color-bone)" />
              <text
                className="t-name"
                x={tx}
                y={p.y - 2}
                textAnchor={left ? "end" : "start"}
                fill="var(--color-bone)"
                fontWeight="600"
              >
                {t.name}
              </text>
              <text
                className="t-km"
                x={tx}
                y={p.y + 22}
                textAnchor={left ? "end" : "start"}
                fill="var(--color-sky)"
                fontFamily="var(--font-plex-mono)"
                letterSpacing="1"
              >
                {distanceFromBase(t.lat, t.lon)} KM
              </text>
            </g>
          );
        })}

        <g>
          <circle className="m-pulse" cx={base.x} cy={base.y} r="16" fill="none" stroke="var(--color-ochre)" strokeWidth="2" />
          <circle className="m-pulse" cx={base.x} cy={base.y} r="16" fill="none" stroke="var(--color-ochre)" strokeWidth="2" />
          <circle cx={base.x} cy={base.y} r="9" fill="var(--color-ochre)" />
          <text className="t-base" x={base.x + 22} y={base.y + 4} fill="var(--color-ochre)" fontWeight="800" style={{ fontStretch: "62%" }}>
            GABORONE
          </text>
          <text x={base.x + 22} y={base.y + 30} fill="var(--color-bone)" fontSize="16" fontFamily="var(--font-plex-mono)" letterSpacing="2">
            BASE
          </text>
        </g>
      </svg>
    </div>
  );
}

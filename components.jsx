// Shared UI primitives + chart. Theme via CSS variables (see theme.css).
const { useState, useEffect, useRef, useMemo, useCallback, Fragment } = React;

// ─── Generic UI ────────────────────────────────────────────────────────────

function Button({ children, onClick, variant = 'primary', size = 'md', icon, type = 'button', disabled, full, style }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`btn btn-${variant} btn-${size}${full ? ' btn-full' : ''}`}
      style={style}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', hint, suffix, autoFocus, error, icon }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <span className={`field-wrap${error ? ' field-wrap-error' : ''}${icon ? ' field-wrap-icon' : ''}`}>
        {icon && <span className="field-icon"><ResourceIcon kind={icon} size={20} /></span>}
        <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoFocus={autoFocus} className="field-input" />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function Card({ children, className = '', style, padding = 'md' }) {
  return <div className={`card card-pad-${padding} ${className}`} style={style}>{children}</div>;
}

function Modal({ open, onClose, title, children, width = 480 }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Tag({ children, hue }) {
  const style = hue != null ? { '--tag-hue': hue } : undefined;
  return <span className="tag" style={style}>{children}</span>;
}

function GameTile({ game, selected, onClick, size = 'md' }) {
  const hue = game.hue ?? 285;
  return (
    <button onClick={onClick} className={`game-tile game-tile-${size}${selected ? ' game-tile-on' : ''}`}
      style={{ '--g-hue': hue }}>
      <div className="game-tile-art">
        <div className="game-tile-glow" />
        {GameMark[game.id]
          ? <span className="game-tile-mark">{GameMark[game.id]({ size: size === 'lg' ? 44 : 32 })}</span>
          : <span className="game-tile-mono">{game.short || game.name.slice(0, 2).toUpperCase()}</span>}
      </div>
      <div className="game-tile-meta">
        <div className="game-tile-name">{game.name}</div>
        <div className="game-tile-sub">{game.resources.length} resources</div>
      </div>
      {selected && <div className="game-tile-check">✓</div>}
    </button>
  );
}

// Original iconographic marks per preset game — generic glyphs that evoke
// each game's vibe without copying real logos.
const GameMark = {
  arknights: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M16 4 L26 12 L22 26 L10 26 L6 12 Z" />
      <path d="M16 4 L16 26 M6 12 L26 12 M10 26 L22 12 M22 26 L10 12" strokeWidth="1" opacity="0.7" />
    </svg>
  ),
  hsr: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="20" cy="12" r="6" />
      <path d="M14 18 L6 26 M16 14 L8 22 M18 16 L10 24" />
      <path d="M20 8 L20.8 11 L23.5 10.5 L21.5 12.5 L23.5 14.5 L20.8 13 L20 16 L19.2 13 L16.5 14.5 L18.5 12.5 L16.5 10.5 L19.2 11 Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  blue_archive: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="16" cy="10" rx="9" ry="3" />
      <path d="M16 14 L16 26 M12 19 L20 19" strokeWidth="2.4" />
    </svg>
  ),
  umamusume: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 8 L8 18 A8 8 0 0 0 24 18 L24 8" />
      <path d="M8 8 L6 8 M8 12 L6 12 M24 8 L26 8 M24 12 L26 12" />
      <circle cx="16" cy="6" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  pjsk: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 22 L12 8 L24 6 L24 20" />
      <ellipse cx="9" cy="22" rx="3" ry="2.2" fill="currentColor" stroke="none" />
      <ellipse cx="21" cy="20" rx="3" ry="2.2" fill="currentColor" stroke="none" />
      <path d="M5 6 L7 8 M27 8 L29 6" opacity="0.7" />
    </svg>
  ),
  limbus: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="16" cy="16" r="10" />
      <path d="M16 6 L16 11 M16 21 L16 26 M6 16 L11 16 M21 16 L26 16" />
      <path d="M16 12 L19 16 L16 18 L13 16 Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  stella_sora: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M16 3 L18.5 13.5 L29 16 L18.5 18.5 L16 29 L13.5 18.5 L3 16 L13.5 13.5 Z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  endfield: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <path d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z" />
      <path d="M11 13 L16 16 L21 13 M16 16 L16 22 M11 19 L11 13 M21 19 L21 13" opacity="0.75" />
      <circle cx="16" cy="16" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  nikke: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="16" cy="16" r="9" />
      <circle cx="16" cy="16" r="3" />
      <path d="M16 3 L16 8 M16 24 L16 29 M3 16 L8 16 M24 16 L29 16" />
      <path d="M7 7 L10 10 M22 22 L25 25 M22 10 L25 7 M7 25 L10 22" opacity="0.7" />
    </svg>
  ),
};

// ─── Number formatting ─────────────────────────────────────────────────────

function fmt(n, dp = 0) {
  if (!isFinite(n)) return '—';
  const r = Math.round(n * 10 ** dp) / 10 ** dp;
  return r.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}
function fmtSigned(n, dp = 0) {
  const s = n >= 0 ? '+' : '−';
  return s + fmt(Math.abs(n), dp);
}

// ─── Chart ─────────────────────────────────────────────────────────────────

function LineChart({ data, width = 720, height = 240, forecastDays = 0, perDay = 0, label = 'Pulls', bannerDate = null, goalPulls = 0 }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(null);

  const padding = { top: 16, right: 16, bottom: 28, left: 44 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;

  const points = useMemo(() => {
    if (!data.length) return { real: [], proj: [], xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
    const t0 = new Date(data[0].ts).getTime();
    const tLast = new Date(data[data.length - 1].ts).getTime();
    const dayMs = 86400000;
    const tEnd = tLast + forecastDays * dayMs;
    const real = data.map((d) => ({ t: new Date(d.ts).getTime(), y: d.pulls, ts: d.ts }));
    const proj = [];
    if (forecastDays > 0 && perDay > 0) {
      const last = real[real.length - 1];
      const steps = Math.min(forecastDays, 60);
      for (let i = 1; i <= steps; i++) {
        const t = last.t + (i / steps) * forecastDays * dayMs;
        proj.push({ t, y: last.y + ((t - last.t) / dayMs) * perDay });
      }
    }
    const bTime = bannerDate ? new Date(bannerDate).getTime() : 0;
    const tEnd = Math.max(tLast + forecastDays * dayMs, bTime);
    const ys = [...real.map((p) => p.y), ...proj.map((p) => p.y)];
    if (goalPulls > 0) ys.push(goalPulls);
    const yMax = Math.max(...ys) * 1.12;
    const yMin = 0;
    return { real, proj, xMin: t0, xMax: tEnd, yMin, yMax };
  }, [data, forecastDays, perDay, bannerDate, goalPulls]);

  const sx = (t) => padding.left + ((t - points.xMin) / (points.xMax - points.xMin || 1)) * w;
  const sy = (y) => padding.top + h - ((y - points.yMin) / (points.yMax - points.yMin || 1)) * h;

  const linePath = points.real.length
    ? points.real.map((p, i) => (i === 0 ? 'M' : 'L') + sx(p.t) + ',' + sy(p.y)).join(' ')
    : '';
  const areaPath = points.real.length
    ? linePath + ` L${sx(points.real[points.real.length - 1].t)},${sy(0)} L${sx(points.real[0].t)},${sy(0)} Z`
    : '';
  const projPath = points.proj.length && points.real.length
    ? `M${sx(points.real[points.real.length - 1].t)},${sy(points.real[points.real.length - 1].y)} ` +
      points.proj.map((p) => `L${sx(p.t)},${sy(p.y)}`).join(' ')
    : '';

  const yTicks = useMemo(() => {
    const step = points.yMax / 4;
    return [0, 1, 2, 3, 4].map((i) => Math.round(i * step));
  }, [points.yMax]);

  const xTicks = useMemo(() => {
    if (!points.real.length) return [];
    const dayMs = 86400000;
    const span = points.xMax - points.xMin;
    const out = [];
    const stride = Math.max(7, Math.ceil(span / dayMs / 6));
    for (let t = points.xMin; t <= points.xMax; t += stride * dayMs) out.push(t);
    return out;
  }, [points.xMin, points.xMax]);

  function onMove(e) {
    if (!points.real.length) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const t = points.xMin + ((x - padding.left) / w) * (points.xMax - points.xMin);
    let best = points.real[0], bd = Infinity;
    for (const p of points.real) {
      const d = Math.abs(p.t - t);
      if (d < bd) { bd = d; best = p; }
    }
    setHover(best);
  }

  return (
    <div className="chart-wrap">
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="chart"
        onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((y) => (
          <g key={'y' + y}>
            <line x1={padding.left} x2={width - padding.right} y1={sy(y)} y2={sy(y)} className="chart-grid" />
            <text x={padding.left - 8} y={sy(y) + 4} className="chart-axis" textAnchor="end">{fmt(y)}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={'x' + t} x={sx(t)} y={height - 8} className="chart-axis" textAnchor="middle">
            {new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </text>
        ))}
        {areaPath && <path d={areaPath} fill="url(#chart-area)" />}
        {linePath && <path d={linePath} className="chart-line" />}
        {projPath && <path d={projPath} className="chart-proj" />}
        {points.real.length === 1 && (
          <circle cx={sx(points.real[0].t)} cy={sy(points.real[0].y)} r="5" className="chart-dot" />
        )}
        {goalPulls > 0 && points.real.length > 0 && (
          <g>
            <line x1={padding.left} x2={width - padding.right} y1={sy(goalPulls)} y2={sy(goalPulls)}
              stroke="var(--success)" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.65" />
            <text x={padding.left + 4} y={sy(goalPulls) - 5} className="chart-axis" fill="var(--success)" opacity="0.85">
              {'Goal: ' + fmt(goalPulls)}
            </text>
          </g>
        )}
        {bannerDate && points.real.length > 0 && (() => {
          const bt = new Date(bannerDate).getTime();
          if (bt <= points.xMax) return (
            <g>
              <line x1={sx(bt)} x2={sx(bt)} y1={padding.top} y2={height - padding.bottom}
                stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
              <text x={sx(bt) + 4} y={padding.top + 12} className="chart-axis" fill="var(--accent)" opacity="0.8">
                {new Date(bannerDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            </g>
          );
          return null;
        })()}
        {hover && (
          <g>
            <line x1={sx(hover.t)} x2={sx(hover.t)} y1={padding.top} y2={height - padding.bottom} className="chart-cross" />
            <circle cx={sx(hover.t)} cy={sy(hover.y)} r="4" className="chart-dot" />
          </g>
        )}
      </svg>
      {hover && (
        <div className="chart-tooltip" style={{ left: `${(sx(hover.t) / width) * 100}%` }}>
          <div className="chart-tooltip-date">{new Date(hover.t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div className="chart-tooltip-val"><span className="num">{fmt(hover.y)}</span> {label}</div>
        </div>
      )}
    </div>
  );
}

// ─── Mini sparkline ────────────────────────────────────────────────────────

function Sparkline({ data, height = 28, width = 80 }) {
  if (!data || data.length < 2) return <svg width={width} height={height} />;
  const ys = data.map((d) => d.pulls);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const yr = yMax - yMin || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((d, i) => `${i * stepX},${height - ((d.pulls - yMin) / yr) * height}`).join(' ');
  return (
    <svg width={width} height={height} className="spark">
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
    </svg>
  );
}

function Stat({ label, value, delta, deltaSuffix = '/wk', mono = true }) {
  const dCls = delta == null ? '' : delta > 0 ? ' stat-up' : delta < 0 ? ' stat-down' : '';
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className={`stat-value${mono ? ' num' : ''}`}>{value}</div>
      {delta != null && (
        <div className={`stat-delta${dCls}`}>
          <span className="num">{fmtSigned(delta, 1)}</span>
          <span className="stat-delta-suffix">{deltaSuffix}</span>
        </div>
      )}
    </div>
  );
}

function PullCount({ value, label = 'pulls', big }) {
  return (
    <div className={`pullcount${big ? ' pullcount-big' : ''}`}>
      <span className="pullcount-value num">{fmt(value, 1)}</span>
      <span className="pullcount-label">{label}</span>
    </div>
  );
}

// ─── Resource icons ────────────────────────────────────────────────────────
// kind: 'gem' | 'gem-premium' | 'ticket' | 'ticket-premium' | 'ticket-bundle' | 'cert' | 'shard'
function ResourceIcon({ kind = 'gem', size = 24, hue }) {
  const style = hue != null ? { '--icon-hue': hue } : undefined;
  const s = size;
  switch (kind) {
    case 'gem':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className="r-icon r-icon-gem" style={style} aria-hidden="true">
          <defs>
            <linearGradient id={`g1-${s}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="oklch(0.85 0.18 var(--icon-hue, var(--accent-hue)))" />
              <stop offset="1" stopColor="oklch(0.55 0.22 var(--icon-hue, var(--accent-hue)))" />
            </linearGradient>
          </defs>
          <path d="M12 2 L20 9 L12 22 L4 9 Z" fill={`url(#g1-${s})`} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
          <path d="M12 2 L20 9 L12 11 L4 9 Z" fill="rgba(255,255,255,0.18)"/>
          <path d="M8 9 L12 11 L16 9 L12 22 Z" fill="rgba(0,0,0,0.12)"/>
        </svg>
      );
    case 'gem-premium':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className="r-icon r-icon-gem-p" style={style} aria-hidden="true">
          <defs>
            <linearGradient id={`g2-${s}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="oklch(0.88 0.18 var(--icon-hue, var(--accent-hue)))" />
              <stop offset="1" stopColor="oklch(0.5 0.24 var(--icon-hue, var(--accent-hue)))" />
            </linearGradient>
          </defs>
          <path d="M12 2 L19 7 L21 14 L12 22 L3 14 L5 7 Z" fill={`url(#g2-${s})`} stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
          <path d="M5 7 L12 9 L19 7 L21 14 L12 9 L3 14 Z" fill="rgba(255,255,255,0.22)"/>
          <path d="M12 9 L12 22" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6"/>
          <circle cx="17" cy="5" r="1.2" fill="white"/>
          <path d="M17 3.5 L17 6.5 M15.5 5 L18.5 5" stroke="white" strokeWidth="0.5" opacity="0.7"/>
        </svg>
      );
    case 'ticket':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className="r-icon r-icon-ticket" style={style} aria-hidden="true">
          <path d="M3 8 A2 2 0 0 1 5 6 L19 6 A2 2 0 0 1 21 8 L21 10 A2 2 0 0 0 21 14 L21 16 A2 2 0 0 1 19 18 L5 18 A2 2 0 0 1 3 16 L3 14 A2 2 0 0 0 3 10 Z"
            fill="oklch(0.7 0.16 var(--icon-hue, var(--accent-hue)))" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
          <path d="M12 6 L12 18" stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" strokeDasharray="1.4 1.4"/>
          <path d="M7 12 L9 12 M15 12 L17 12" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
        </svg>
      );
    case 'ticket-premium':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className="r-icon r-icon-ticket-p" style={style} aria-hidden="true">
          <path d="M3 8 A2 2 0 0 1 5 6 L19 6 A2 2 0 0 1 21 8 L21 10 A2 2 0 0 0 21 14 L21 16 A2 2 0 0 1 19 18 L5 18 A2 2 0 0 1 3 16 L3 14 A2 2 0 0 0 3 10 Z"
            fill="oklch(0.65 0.22 var(--icon-hue, var(--accent-hue)))" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9"/>
          <path d="M12 8.4 L13 11 L15.7 11.1 L13.6 12.8 L14.3 15.4 L12 13.9 L9.7 15.4 L10.4 12.8 L8.3 11.1 L11 11 Z"
            fill="white"/>
        </svg>
      );
    case 'ticket-bundle':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className="r-icon r-icon-bundle" style={style} aria-hidden="true">
          <path d="M5 10 A1.6 1.6 0 0 1 6.6 8.4 L18.4 8.4 A1.6 1.6 0 0 1 20 10 L20 11.6 A1.6 1.6 0 0 0 20 14.8 L20 16.4 A1.6 1.6 0 0 1 18.4 18 L6.6 18 A1.6 1.6 0 0 1 5 16.4 L5 14.8 A1.6 1.6 0 0 0 5 11.6 Z"
            fill="oklch(0.7 0.16 var(--icon-hue, var(--accent-hue)))" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
          <path d="M3 7 A1.6 1.6 0 0 1 4.6 5.4 L16.4 5.4 A1.6 1.6 0 0 1 18 7"
            fill="none" stroke="oklch(0.78 0.14 var(--icon-hue, var(--accent-hue)))" strokeWidth="1.6" strokeLinecap="round"/>
          <text x="12.5" y="15.2" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="6" fill="white">×10</text>
        </svg>
      );
    case 'cert':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className="r-icon r-icon-cert" style={style} aria-hidden="true">
          <rect x="4" y="4" width="14" height="17" rx="1.4" fill="oklch(0.78 0.1 var(--icon-hue, var(--accent-hue)))" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
          <path d="M7 8 L15 8 M7 11 L13 11 M7 14 L11 14" stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" strokeLinecap="round"/>
          <circle cx="17" cy="17" r="4" fill="oklch(0.65 0.2 var(--icon-hue, var(--accent-hue)))" stroke="white" strokeWidth="1"/>
          <path d="M15.5 17 L16.5 18 L18.5 16" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      );
    case 'shard':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" className="r-icon r-icon-shard" style={style} aria-hidden="true">
          <defs>
            <linearGradient id={`g3-${s}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="oklch(0.86 0.14 var(--icon-hue, var(--accent-hue)))" />
              <stop offset="1" stopColor="oklch(0.5 0.2 var(--icon-hue, var(--accent-hue)))" />
            </linearGradient>
          </defs>
          <path d="M9 2 L17 5 L21 13 L14 22 L7 20 L3 11 Z" fill={`url(#g3-${s})`} stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>
          <path d="M9 2 L13 12 L21 13 M13 12 L14 22 M13 12 L3 11" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" fill="none"/>
        </svg>
      );
    default:
      return null;
  }
}

// Brand logo — five-pointed gacha sparkle-star.
function BrandLogo({ size = 22, glow = true }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={`brand-logo${glow ? ' brand-logo-glow' : ''}`} aria-hidden="true">
      <defs>
        <radialGradient id="bl-fill" cx="0.3" cy="0.3" r="0.9">
          <stop offset="0" stopColor="oklch(0.92 0.12 var(--accent-hue))"/>
          <stop offset="0.6" stopColor="oklch(0.7 0.18 var(--accent-hue))"/>
          <stop offset="1" stopColor="oklch(0.45 0.22 var(--accent-hue))"/>
        </radialGradient>
      </defs>
      <path d="M12 1.5 L14.6 9.4 L22.8 9.4 L16.2 14.2 L18.8 22 L12 17.2 L5.2 22 L7.8 14.2 L1.2 9.4 L9.4 9.4 Z"
        fill="url(#bl-fill)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" strokeLinejoin="round"/>
      <circle cx="9" cy="7.5" r="1.1" fill="white" opacity="0.9"/>
      <path d="M16.5 5.5 L17.5 6.5 M16.5 6.5 L17.5 5.5" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.8"/>
    </svg>
  );
}

Object.assign(window, {
  Button, Input, Card, Modal, Tag, GameTile,
  LineChart, Sparkline, Stat, PullCount,
  fmt, fmtSigned, ResourceIcon, BrandLogo,
});

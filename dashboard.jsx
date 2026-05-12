// Dashboard + Settings + log snapshot modal + share card.
const { useState: useStateD, useMemo: useMemoD, useEffect: useEffectD } = React;

function Dashboard({ store, onUpdate, onSignOut, onOpenSettings, themeName }) {
  const [activeId, setActiveId] = useStateD(store.games[0]?.id);
  const [showLog, setShowLog] = useStateD(false);
  const [showCustom, setShowCustom] = useStateD(false);
  const [editing, setEditing] = useStateD(null);
  const [showShare, setShowShare] = useStateD(false);
  const [showBannerModal, setShowBannerModal] = useStateD(false);
  const [bannerForm, setBannerForm] = useStateD({ name: '', date: '', goalPulls: '' });

  const active = store.games.find((g) => g.id === activeId) || store.games[0];

  const openBannerModal = () => {
    setBannerForm({
      name: active?.banner?.name || '',
      date: active?.banner?.date || '',
      goalPulls: active?.banner?.goalPulls?.toString() || '',
    });
    setShowBannerModal(true);
  };

  const addGame = (g) => {
    const games = [...store.games, { ...g, latest: {}, snapshots: [] }];
    onUpdate({ ...store, games });
    setActiveId(g.id);
    setShowCustom(false);
  };

  const saveSnapshot = (counts) => {
    const pulls = window.computePulls(active.resources, counts);
    const today = new Date().toISOString().slice(0, 10);
    const snapshots = [...(active.snapshots || []).filter((s) => s.ts !== today), { ts: today, counts: { ...counts }, pulls }];
    snapshots.sort((a, b) => a.ts.localeCompare(b.ts));
    const games = store.games.map((g) => g.id === active.id ? { ...g, latest: counts, snapshots } : g);
    onUpdate({ ...store, games });
  };

  const removeGame = (id) => {
    const games = store.games.filter((g) => g.id !== id);
    onUpdate({ ...store, games });
    if (activeId === id && games.length) setActiveId(games[0].id);
  };

  const saveBanner = () => {
    if (!bannerForm.date || !bannerForm.goalPulls) return;
    const games = store.games.map((g) => g.id === active.id
      ? { ...g, banner: { name: bannerForm.name, date: bannerForm.date, goalPulls: Number(bannerForm.goalPulls) } }
      : g);
    onUpdate({ ...store, games });
    setShowBannerModal(false);
  };

  const clearBanner = () => {
    const games = store.games.map((g) => g.id === active.id ? { ...g, banner: null } : g);
    onUpdate({ ...store, games });
    setShowBannerModal(false);
  };

  if (!active) return null;

  const snapshots = (active.snapshots && active.snapshots.length) ? active.snapshots : [];

  const stats = window.computeStats(snapshots);

  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="dash-side-brand">
          <BrandLogo size={20} />
          <span className="brand-name">{themeName === 'cipher' ? 'CIPHER' : 'Lumen'}</span>
        </div>
        <div className="dash-side-section">My games</div>
        <div className="dash-side-games">
          {store.games.map((g) => {
            const gSnaps = (g.snapshots && g.snapshots.length) ? g.snapshots : [];
            const gStats = window.computeStats(gSnaps);
            return (
              <button key={g.id} onClick={() => setActiveId(g.id)}
                className={`dash-side-game${g.id === active.id ? ' on' : ''}`}>
                <div className="dash-side-mono" style={{ '--g-hue': g.hue }}>{g.short}</div>
                <div className="dash-side-info">
                  <div className="dash-side-name">{g.name}</div>
                  <div className="dash-side-pulls">
                    <span className="num">{fmt(gStats.current, 1)}</span> pulls
                  </div>
                </div>
                <div className="dash-side-spark">
                  <Sparkline data={gSnaps.slice(-10)} width={42} height={20} />
                </div>
              </button>
            );
          })}
          <button className="dash-side-add" onClick={() => setShowCustom(true)}>＋ Add game</button>
        </div>
        <div className="dash-side-foot">
          <button className="dash-side-action" onClick={onOpenSettings}>Settings</button>
          <button className="dash-side-action" onClick={onSignOut}>Sign out</button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-head">
          <div className="dash-head-id">
            <div className="dash-head-mono" style={{ '--g-hue': active.hue }}>{active.short}</div>
            <div>
              <div className="dash-head-name">
                {active.name}
                {active.custom && <button className="dash-head-edit" onClick={() => setEditing(active)} title="Edit game">⚙</button>}
              </div>
              <div className="dash-head-sub">
                Last snapshot · <span className="num">{snapshots.length ? snapshots[snapshots.length - 1].ts : '—'}</span>
                <span className="dash-head-dot" />
                <span className="num">{snapshots.length}</span> entries
              </div>
            </div>
          </div>
          <div className="dash-head-actions">
            <button className="btn btn-ghost" onClick={() => setShowShare(true)}>Share</button>
            <Button onClick={() => setShowLog(true)} icon="+">Log snapshot</Button>
          </div>
        </header>

        <section className="dash-hero">
          <div className="dash-hero-pull">
            <div className="dash-hero-label">Pull power</div>
            <div className="dash-hero-num"><span className="num">{fmt(stats.current, 1)}</span></div>
            <div className="dash-hero-suffix">pulls available right now</div>
          </div>
          <div className="dash-hero-stats">
            <Stat label="Last 7 days" value={fmtSigned(stats.deltaWeek, 1)} delta={stats.deltaWeek} deltaSuffix="net" />
            <Stat label="Avg / week" value={fmt(stats.weekly, 1)} />
            <Stat label="Avg / month" value={fmt(stats.monthly, 1)} />
          </div>
        </section>

        <section className="dash-chart-section">
          <div className="dash-section-head">
            <h3>Pull history</h3>
            <div className="dash-section-legend">
              <span className="legend-dot legend-real" /> Logged
              <span className="legend-dot legend-proj" /> Forecast
            </div>
          </div>
          <Card padding="lg" className="dash-chart-card">
            <LineChart data={snapshots} width={760} height={260}
              forecastDays={Math.max(active.banner?.date ? Math.max(0, Math.round((new Date(active.banner.date) - new Date()) / 86400000)) : 14, 7)}
              perDay={stats.perDay}
              bannerDate={active.banner?.date || null}
              goalPulls={active.banner?.goalPulls || 0} />
          </Card>
        </section>

        <section className="dash-bottom">
          <Card className="dash-banner" padding="lg">
            <div className="dash-banner-head">
              <span className="dash-banner-tag">Banner goal</span>
              {active.banner && <span className="dash-banner-name">{active.banner.name || 'Unnamed'}</span>}
              <button className="btn btn-ghost btn-sm" onClick={openBannerModal}>
                {active.banner ? 'Edit' : 'Set one'}
              </button>
            </div>
            {active.banner ? (() => {
              const daysUntil = Math.max(0, Math.round((new Date(active.banner.date) - new Date()) / 86400000));
              const projected = window.forecastBy(stats.current, stats.perDay, daysUntil);
              const goal = active.banner.goalPulls;
              return (
                <div className="dash-banner-body">
                  <div className="dash-banner-days">
                    <span className="num">{daysUntil}</span>
                    <span className="dash-banner-days-l">days</span>
                  </div>
                  <div className="dash-banner-forecast">
                    <div className="dash-banner-forecast-row">
                      <span>Projected</span>
                      <span className="num">{fmt(projected, 1)} pulls</span>
                    </div>
                    <div className="dash-banner-forecast-row">
                      <span>Goal</span>
                      <span className="num">{fmt(goal, 0)} pulls</span>
                    </div>
                    <div className="dash-banner-meter">
                      <div className="dash-banner-meter-fill"
                        style={{ width: `${Math.min(100, (projected / goal) * 100)}%` }} />
                    </div>
                    <div className="dash-banner-forecast-pity">
                      {projected >= goal
                        ? <><span className="dash-banner-pity-on">●</span> On track</>
                        : <><span className="dash-banner-pity-off">●</span> Need {fmt(goal - projected, 1)} more</>}
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="banner-empty">Set a date and pull target to see your forecast on the chart.</div>
            )}
          </Card>

          <Card className="dash-res" padding="lg">
            <div className="dash-section-head dash-section-head-inner">
              <h3>Current resources</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowLog(true)}>Update</button>
            </div>
            <div className="dash-res-list">
              {active.resources.map((r) => {
                const c = Number(active.latest?.[r.id] ?? (snapshots.length ? snapshots[snapshots.length - 1].counts[r.id] : 0) ?? 0);
                const inPulls = c / r.perPull;
                return (
                  <div className="dash-res-row" key={r.id}>
                    <div className="dash-res-name">
                      <span className="dash-res-icon"><ResourceIcon kind={r.icon || 'gem'} size={24} hue={active.hue} /></span>
                      <span className="dash-res-namecol">
                        <span>{r.name}</span>
                        <span className="dash-res-hint">{r.hint}</span>
                      </span>
                    </div>
                    <div className="dash-res-count num">{fmt(c)}</div>
                    <div className="dash-res-pulls">
                      <span className="num">{fmt(inPulls, 1)}</span>
                      <span className="dash-res-pulls-l">pulls</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      </main>

      <LogSnapshotModal open={showLog} onClose={() => setShowLog(false)} game={active}
        last={active.latest || snapshots[snapshots.length - 1].counts} onSave={saveSnapshot} />
      <CustomGameModal open={showCustom} onClose={() => setShowCustom(false)} onSave={addGame} />
      <CustomGameModal open={!!editing} initial={editing} onClose={() => setEditing(null)}
        onSave={(g) => { onUpdate({ ...store, games: store.games.map((x) => x.id === g.id ? { ...x, ...g } : x) }); setEditing(null); }} />
      <ShareModal open={showShare} onClose={() => setShowShare(false)} game={active} stats={stats} snapshots={snapshots} user={store.user} themeName={themeName} />
      <Modal open={showBannerModal} onClose={() => setShowBannerModal(false)} title="Banner goal" width={440}>
        <div className="logsnap">
          <Input label="Banner name (optional)" value={bannerForm.name}
            onChange={(v) => setBannerForm((f) => ({ ...f, name: v }))}
            placeholder="e.g. Character Event Warp" />
          <div className="logsnap-fields">
            <Input label="End date" type="date" value={bannerForm.date}
              onChange={(v) => setBannerForm((f) => ({ ...f, date: v }))} />
            <Input label="Pull goal" type="number" value={bannerForm.goalPulls}
              onChange={(v) => setBannerForm((f) => ({ ...f, goalPulls: v }))}
              placeholder="e.g. 90" />
          </div>
          <div className="cg-actions">
            {active.banner && (
              <button className="btn btn-danger btn-sm" onClick={clearBanner}>Remove</button>
            )}
            <button className="btn btn-ghost" onClick={() => setShowBannerModal(false)}>Cancel</button>
            <Button onClick={saveBanner} disabled={!bannerForm.date || !bannerForm.goalPulls}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function LogSnapshotModal({ open, onClose, game, last, onSave }) {
  const [counts, setCounts] = useStateD({});
  useEffectD(() => { if (open) setCounts({ ...last }); }, [open, last]);
  const pulls = window.computePulls(game.resources, counts);
  return (
    <Modal open={open} onClose={onClose} title={`Log snapshot · ${game.name}`} width={520}>
      <div className="logsnap">
        <p className="logsnap-sub">Type your current totals for each resource. Empty values keep the last logged amount.</p>
        <div className="logsnap-fields">
          {game.resources.map((r) => (
            <Input key={r.id} label={r.name} type="number" placeholder="0" hint={r.hint} icon={r.icon || 'gem'}
              value={counts[r.id] ?? ''} onChange={(v) => setCounts((c) => ({ ...c, [r.id]: v }))} />
          ))}
        </div>
        <div className="logsnap-summary">
          <span>That's</span>
          <PullCount value={pulls} />
        </div>
        <div className="cg-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <Button onClick={() => { onSave(counts); onClose(); }}>Save snapshot</Button>
        </div>
      </div>
    </Modal>
  );
}

function ShareModal({ open, onClose, game, stats, snapshots, user, themeName }) {
  return (
    <Modal open={open} onClose={onClose} title="Share summary" width={560}>
      <p className="logsnap-sub">A clean card to drop into your guild chat or send to a friend.</p>
      <div className="share-card" style={{ '--g-hue': game.hue }}>
        <div className="share-card-head">
          <div className="share-card-mono">{game.short}</div>
          <div className="share-card-meta">
            <div className="share-card-game">{game.name}</div>
            <div className="share-card-user">@{user?.name || 'traveller'}</div>
          </div>
        </div>
        <div className="share-card-big">
          <span className="num">{fmt(stats.current, 1)}</span>
          <span className="share-card-big-l">pulls</span>
        </div>
        <div className="share-card-stats">
          <div><div className="share-card-stat-l">Weekly avg</div><div className="num">{fmt(stats.weekly, 1)}</div></div>
          <div><div className="share-card-stat-l">Last 7d</div><div className="num">{fmtSigned(stats.deltaWeek, 1)}</div></div>
          <div><div className="share-card-stat-l">In {game.bannerDaysFromNow ?? 14}d</div><div className="num">{fmt(window.forecastBy(stats.current, stats.perDay, game.bannerDaysFromNow ?? 14), 0)}</div></div>
        </div>
        <div className="share-card-spark">
          <Sparkline data={snapshots} width={460} height={42} />
        </div>
        <div className="share-card-foot">tracked with {themeName === 'cipher' ? 'CIPHER' : 'Lumen'}</div>
      </div>
      <div className="cg-actions">
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
        <Button onClick={onClose}>Copy image</Button>
      </div>
    </Modal>
  );
}

function Settings({ store, onUpdate, onBack, themeName }) {
  const [accent, setAccent] = useStateD(store.prefs?.accentHue ?? (themeName === 'cipher' ? 280 : 295));
  useEffectD(() => {
    onUpdate({ ...store, prefs: { ...store.prefs, accentHue: accent } });
    document.documentElement.style.setProperty('--accent-hue', accent);
  }, [accent]);
  return (
    <div className="settings">
      <header className="settings-head">
        <button className="auth-back" onClick={onBack}>← Back</button>
        <h1>Settings</h1>
      </header>
      <div className="settings-body">
        <Card padding="lg">
          <h3 className="settings-h">Account</h3>
          <div className="settings-row">
            <div className="settings-row-l">Email</div>
            <div className="settings-row-v num">{store.user?.email}</div>
          </div>
          <div className="settings-row">
            <div className="settings-row-l">Display name</div>
            <div className="settings-row-v">{store.user?.name}</div>
          </div>
        </Card>
        <Card padding="lg">
          <h3 className="settings-h">Appearance</h3>
          <div className="settings-row settings-row-col">
            <div className="settings-row-l">Accent hue</div>
            <div className="settings-hue-wrap">
              <input type="range" min="240" max="360" value={accent} onChange={(e) => setAccent(Number(e.target.value))} className="cg-hue-slider" />
              <span className="cg-hue-preview"><span className="cg-hue-dot" style={{ background: `oklch(0.7 0.18 ${accent})` }} /><span className="num">{accent}°</span></span>
            </div>
          </div>
        </Card>
        <Card padding="lg">
          <h3 className="settings-h">Data</h3>
          <div className="settings-row">
            <div>
              <div className="settings-row-l">Export all data</div>
              <div className="settings-row-hint">A JSON blob of every game, snapshot, and preference.</div>
            </div>
            <button className="btn btn-ghost btn-sm"
              onClick={() => {
                const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'pull-tracker-data.json';
                a.click();
              }}>Download</button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-l settings-danger">Reset everything</div>
              <div className="settings-row-hint">Delete all snapshots and tracked games. Cannot be undone.</div>
            </div>
            <button className="btn btn-danger btn-sm"
              onClick={() => {
                if (confirm('Delete all data? This cannot be undone.')) {
                  onUpdate({ user: store.user, games: [], prefs: {} });
                  onBack();
                }
              }}>Reset</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, Settings });

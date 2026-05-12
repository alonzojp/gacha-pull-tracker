// Onboarding (game picker → resource counts) and custom-game builder.
const { useState: useStateO } = React;

function Onboarding({ onComplete, presets, onBack }) {
  const [step, setStep] = useStateO(0);
  const [selectedIds, setSelectedIds] = useStateO(['hsr']);
  const [customGames, setCustomGames] = useStateO([]);
  const [counts, setCounts] = useStateO({});
  const [showCustom, setShowCustom] = useStateO(false);

  const allGames = [...presets, ...customGames];
  const selected = allGames.filter((g) => selectedIds.includes(g.id));

  const toggle = (id) => {
    setSelectedIds((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const setCount = (gid, rid, v) => {
    setCounts((c) => ({ ...c, [gid]: { ...(c[gid] || {}), [rid]: v } }));
  };

  const finish = () => {
    const today = new Date().toISOString().slice(0, 10);
    const games = selected.map((g) => {
      const gameCounts = counts[g.id] || {};
      const pulls = window.computePulls(g.resources, gameCounts);
      return {
        ...g,
        latest: gameCounts,
        snapshots: [{ ts: today, counts: gameCounts, pulls }],
      };
    });
    onComplete({ games });
  };

  if (step === 0) {
    return (
      <div className="onb">
        <div className="onb-top">
          <button className="auth-back" onClick={onBack}>← Back</button>
          <div className="onb-progress">
            <div className="onb-progress-step on">Pick games</div>
            <span className="onb-progress-sep" />
            <div className="onb-progress-step">Initial counts</div>
          </div>
        </div>
        <div className="onb-body">
          <h1 className="onb-title">Which games are you tracking?</h1>
          <p className="onb-sub">Pick any number. You can always add or remove later from the dashboard.</p>
          <div className="onb-grid">
            {allGames.map((g) => (
              <GameTile key={g.id} game={g} selected={selectedIds.includes(g.id)} onClick={() => toggle(g.id)} size="lg" />
            ))}
            <button className="game-tile game-tile-lg game-tile-add" onClick={() => setShowCustom(true)}>
              <div className="game-tile-art">
                <span className="game-tile-mono">＋</span>
              </div>
              <div className="game-tile-meta">
                <div className="game-tile-name">Custom game</div>
                <div className="game-tile-sub">Define your own</div>
              </div>
            </button>
          </div>
        </div>
        <div className="onb-foot">
          <div className="onb-foot-meta">
            <span className="num">{selectedIds.length}</span> selected
          </div>
          <Button onClick={() => setStep(1)} disabled={selectedIds.length === 0} size="lg">
            Continue →
          </Button>
        </div>
        <CustomGameModal open={showCustom} onClose={() => setShowCustom(false)}
          onSave={(g) => { setCustomGames((c) => [...c, g]); setSelectedIds((s) => [...s, g.id]); setShowCustom(false); }} />
      </div>
    );
  }

  return (
    <div className="onb">
      <div className="onb-top">
        <button className="auth-back" onClick={() => setStep(0)}>← Back</button>
        <div className="onb-progress">
          <div className="onb-progress-step done">Pick games</div>
          <span className="onb-progress-sep" />
          <div className="onb-progress-step on">Initial counts</div>
        </div>
      </div>
      <div className="onb-body">
        <h1 className="onb-title">Enter your current totals.</h1>
        <p className="onb-sub">Don't have exact numbers? Take a screenshot, type rough estimates, and refine later. We use these to compute today's pull power.</p>
        <div className="onb-games">
          {selected.map((g) => {
            const c = counts[g.id] || {};
            const pulls = window.computePulls(g.resources, c);
            return (
              <Card key={g.id} className="onb-game">
                <div className="onb-game-head">
                  <div className="onb-game-id">
                    <div className="demo-dash-mono" style={{ '--g-hue': g.hue }}>{g.short}</div>
                    <div>
                      <div className="onb-game-name">{g.name}</div>
                      <div className="onb-game-sub">{g.resources.length} resources</div>
                    </div>
                  </div>
                  <PullCount value={pulls} />
                </div>
                <div className="onb-resources">
                  {g.resources.map((r) => (
                    <Input key={r.id} label={r.name} hint={r.hint} type="number" icon={r.icon || 'gem'}
                      value={c[r.id] ?? ''} onChange={(v) => setCount(g.id, r.id, v)} placeholder="0" />
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="onb-foot">
        <div className="onb-foot-meta">Step 2 of 2</div>
        <Button onClick={finish} size="lg">Open dashboard →</Button>
      </div>
    </div>
  );
}

function CustomGameModal({ open, onClose, onSave, initial }) {
  const [name, setName] = useStateO(initial?.name || '');
  const [short, setShort] = useStateO(initial?.short || '');
  const [hue, setHue] = useStateO(initial?.hue ?? 260);
  const [bannerName, setBannerName] = useStateO(initial?.bannerName || '');
  const [bannerDays, setBannerDays] = useStateO(initial?.bannerDaysFromNow ?? 14);
  const [resources, setResources] = useStateO(initial?.resources?.length ? initial.resources : [
    { id: 'r1', name: '', perPull: 1, hint: '' },
  ]);

  React.useEffect(() => {
    if (open && !initial) {
      setName(''); setShort(''); setHue(260); setBannerName(''); setBannerDays(14);
      setResources([{ id: 'r1', name: '', perPull: 1, hint: '' }]);
    } else if (open && initial) {
      setName(initial.name); setShort(initial.short); setHue(initial.hue);
      setBannerName(initial.bannerName || ''); setBannerDays(initial.bannerDaysFromNow ?? 14);
      setResources(initial.resources);
    }
  }, [open, initial]);

  const updateRes = (i, patch) => setResources((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r));
  const addRes = () => setResources((rs) => [...rs, { id: 'r' + (rs.length + 1), name: '', perPull: 1, hint: '' }]);
  const removeRes = (i) => setResources((rs) => rs.filter((_, j) => j !== i));

  const save = () => {
    if (!name.trim()) return;
    const valid = resources.filter((r) => r.name.trim() && r.perPull > 0);
    if (!valid.length) return;
    onSave({
      id: initial?.id || ('custom_' + Date.now()),
      name: name.trim(),
      short: (short || name.slice(0, 3)).toUpperCase(),
      hue: Number(hue),
      bannerName,
      bannerDaysFromNow: Number(bannerDays),
      resources: valid.map((r, i) => ({
        id: r.id || 'r' + i,
        name: r.name.trim(),
        perPull: Number(r.perPull),
        hint: r.hint || `${r.perPull} per pull`,
      })),
      custom: true,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit game' : 'Build a custom game'} width={560}>
      <div className="cg-form">
        <div className="cg-row">
          <Input label="Game name" value={name} onChange={setName} placeholder="e.g. Project Sekai" autoFocus />
          <Input label="Short tag" value={short} onChange={setShort} placeholder="3 letters" hint="Shown on tiles" />
        </div>
        <div className="cg-row">
          <Input label="Banner name (optional)" value={bannerName} onChange={setBannerName} placeholder="e.g. Limited Recruitment" />
          <Input label="Banner ends in" value={bannerDays} onChange={setBannerDays} type="number" suffix="days" />
        </div>
        <label className="field">
          <span className="field-label">Theme hue</span>
          <span className="cg-hue-wrap">
            <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(e.target.value)} className="cg-hue-slider" />
            <span className="cg-hue-preview" style={{ '--g-hue': hue }}>
              <span className="cg-hue-dot" />
              <span className="num">{hue}°</span>
            </span>
          </span>
        </label>
        <div className="cg-resources">
          <div className="cg-resources-head">
            <span>Resources</span>
            <span className="cg-resources-hint">Add every currency/ticket that contributes to a pull</span>
          </div>
          {resources.map((r, i) => (
            <div className="cg-resource" key={i}>
              <div className="cg-resource-name">
                <Input label={i === 0 ? 'Name' : null} value={r.name} onChange={(v) => updateRes(i, { name: v })} placeholder="Resource name" />
              </div>
              <div className="cg-resource-per">
                <Input label={i === 0 ? 'Per pull' : null} value={r.perPull} onChange={(v) => updateRes(i, { perPull: v })} type="number" hint={i === 0 ? '1 = ticket; 600 = 600 of this = 1 pull' : null} />
              </div>
              <button className="cg-resource-del" onClick={() => removeRes(i)} disabled={resources.length === 1} aria-label="Remove">×</button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addRes}>+ Add resource</button>
        </div>
        <div className="cg-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <Button onClick={save} disabled={!name.trim() || !resources.some((r) => r.name.trim())}>
            {initial ? 'Save changes' : 'Create game'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { Onboarding, CustomGameModal });

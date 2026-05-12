// Landing + auth screens.
const { useState: useStateL, useMemo: useMemoL } = React;

function Landing({ onStart, onSignIn, themeName }) {
  const sampleGame = window.PRESET_GAMES.find((g) => g.id === 'hsr');
  const snapshots = useMemoL(() => window.generateSampleSnapshots(sampleGame, 7), []);
  const stats = useMemoL(() => window.computeStats(snapshots), [snapshots]);

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand">
          <BrandLogo size={22} />
          <span className="brand-name">{themeName === 'cipher' ? 'CIPHER' : 'Lumen'}</span>
          <span className="brand-tag">pull tracker</span>
        </div>
        <div className="landing-nav-actions">
          <button className="btn btn-ghost btn-sm" onClick={onSignIn}>Sign in</button>
          <Button onClick={onStart} size="sm">Get started</Button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-eyebrow">
          <span className="hero-dot" /> Free · No game account required
        </div>
        <h1 className="hero-title">
          Track every pull. <br />
          Plan every banner.
        </h1>
        <p className="hero-sub">
          A snapshot-based ledger for gacha resources across every game you play.
          See your real pull power, weekly gain rate, and whether you'll hit pity
          before that limited banner ends.
        </p>
        <div className="hero-actions">
          <Button onClick={onStart} size="lg">Start tracking — it's free</Button>
          <button className="btn btn-ghost btn-lg" onClick={onSignIn}>I already have an account</button>
        </div>
        <div className="hero-meta">
          <span><span className="num">9</span> preset games</span>
          <span className="hero-meta-dot" />
          <span>Build your own templates</span>
          <span className="hero-meta-dot" />
          <span>Local-first data</span>
        </div>
      </section>

      <section className="landing-demo">
        <div className="landing-demo-head">
          <div>
            <div className="landing-demo-eyebrow">Live preview · sample account</div>
            <h2>Your dashboard, on day one.</h2>
          </div>
        </div>
        <div className="landing-demo-card">
          <DemoDashboard game={sampleGame} snapshots={snapshots} stats={stats} />
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-glyph">◆</div>
          <h3>Snapshot logging</h3>
          <p>Drop in your current totals whenever you remember. The app computes deltas, gain rates, and totals. No manual transaction entry.</p>
        </div>
        <div className="feature">
          <div className="feature-glyph">◑</div>
          <h3>Forecast by date</h3>
          <p>Set a banner end date. See how many pulls you'll likely have by then at your current weekly gain — and whether you're on track for pity.</p>
        </div>
        <div className="feature">
          <div className="feature-glyph">⬡</div>
          <h3>Custom games</h3>
          <p>Building a tracker for an indie gacha or alpha test? Define your own resources and conversion rates in under a minute.</p>
        </div>
        <div className="feature">
          <div className="feature-glyph">⤴</div>
          <h3>Shareable summaries</h3>
          <p>Export a clean summary card to send to your guild, or pin a JSON snapshot of your entire history for safekeeping.</p>
        </div>
      </section>

      <section className="cta">
        <h2>Pull with intent.</h2>
        <p>Three minutes to set up. A lifetime of fewer regretted pulls.</p>
        <Button onClick={onStart} size="lg">Create your account</Button>
      </section>

      <footer className="landing-foot">
        <span>{themeName === 'cipher' ? 'CIPHER' : 'Lumen'} · pull tracker</span>
        <span className="landing-foot-sep" />
        <span>Not affiliated with any game studio. Resource conversion data is editable per game.</span>
      </footer>
    </div>
  );
}

function DemoDashboard({ game, snapshots, stats }) {
  return (
    <div className="demo-dash">
      <div className="demo-dash-head">
        <div className="demo-dash-game">
          <div className="demo-dash-mono" style={{ '--g-hue': game.hue }}>{game.short}</div>
          <div>
            <div className="demo-dash-name">{game.name}</div>
            <div className="demo-dash-sub">Last snapshot · {snapshots[snapshots.length - 1].ts}</div>
          </div>
        </div>
        <div className="demo-dash-pull">
          <span className="num">{fmt(stats.current, 1)}</span>
          <span className="demo-dash-pull-l">pulls available</span>
        </div>
      </div>
      <div className="demo-dash-chart">
        <LineChart data={snapshots} width={680} height={180} />
      </div>
      <div className="demo-dash-stats">
        <Stat label="This week" value={fmtSigned(stats.deltaWeek, 1)} delta={stats.deltaWeek} deltaSuffix="net" />
        <Stat label="Avg / week" value={fmt(stats.weekly, 1)} />
        <Stat label="Avg / month" value={fmt(stats.monthly, 1)} />
        <Stat label="In 14 days" value={fmt(window.forecastBy(stats.current, stats.perDay, 14), 0)} />
      </div>
    </div>
  );
}

function Auth({ mode = 'signup', onComplete, onSwitchMode, onBack, onDemo }) {
  const [email, setEmail] = useStateL('');
  const [password, setPassword] = useStateL('');
  const [name, setName] = useStateL('');
  const [err, setErr] = useStateL(null);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setErr('Enter a valid email.'); return; }
    if (password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    onComplete({ email, name: name || email.split('@')[0] });
  };

  return (
    <div className="auth-screen">
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-brand">
          <BrandLogo size={36} />
        </div>
        <h1 className="auth-title">{mode === 'signup' ? 'Create your tracker' : 'Welcome back'}</h1>
        <p className="auth-sub">
          {mode === 'signup'
            ? 'No game account needed. Your data stays in your browser.'
            : 'Sign in to pick up your snapshot history.'}
        </p>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <Input label="Display name" value={name} onChange={setName} placeholder="Trailblazer" />
          )}
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoFocus />
          <Input label="Password" type="password" value={password} onChange={setPassword}
            placeholder="••••••••" hint={mode === 'signup' ? 'Min. 6 characters.' : null} />
          {err && <div className="auth-error">{err}</div>}
          <Button type="submit" full size="lg">{mode === 'signup' ? 'Create account' : 'Sign in'}</Button>
        </form>
        <div className="auth-switch">
          {mode === 'signup' ? (
            <>Already have one? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode('signin'); }}>Sign in</a></>
          ) : (
            <>New here? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode('signup'); }}>Create an account</a></>
          )}
        </div>
        <div className="auth-divider"><span>or</span></div>
        <button className="btn btn-ghost btn-full" onClick={onDemo}>Continue in demo mode</button>
      </div>
    </div>
  );
}

Object.assign(window, { Landing, Auth });

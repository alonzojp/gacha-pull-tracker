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
          <span className="hero-dot" /> Free · No account needed
        </div>
        <h1 className="hero-title">
          Know your pulls.
        </h1>
        <p className="hero-sub">
          Log your gacha resources, see how many pulls you have, and check
          if you'll have enough before a banner ends.
        </p>
        <div className="hero-actions">
          <Button onClick={onStart} size="lg">Get started</Button>
          <button className="btn btn-ghost btn-lg" onClick={onSignIn}>Sign in</button>
        </div>
        <div className="hero-meta">
          <span><span className="num">9</span> preset games</span>
          <span className="hero-meta-dot" />
          <span>Custom games</span>
          <span className="hero-meta-dot" />
          <span>Saves locally</span>
        </div>
      </section>

      <section className="landing-demo">
        <div className="landing-demo-head">
          <div>
            <div className="landing-demo-eyebrow">Sample account</div>
            <h2>What it looks like</h2>
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
          <p>Enter your current resource counts whenever. The app calculates your pull total and tracks it over time.</p>
        </div>
        <div className="feature">
          <div className="feature-glyph">◑</div>
          <h3>Banner forecast</h3>
          <p>Set a banner end date and see how many pulls you'll have by then based on your recent gain rate.</p>
        </div>
        <div className="feature">
          <div className="feature-glyph">⬡</div>
          <h3>Custom games</h3>
          <p>Game not on the list? Add it yourself with custom resources and conversion rates.</p>
        </div>
        <div className="feature">
          <div className="feature-glyph">⤴</div>
          <h3>Share</h3>
          <p>Generate a summary card to share with friends or your server.</p>
        </div>
      </section>

      <section className="cta">
        <h2>Get started</h2>
        <p>Takes about a minute to set up.</p>
        <Button onClick={onStart} size="lg">Create an account</Button>
      </section>

      <footer className="landing-foot">
        <span>{themeName === 'cipher' ? 'CIPHER' : 'Lumen'} · pull tracker</span>
        <span className="landing-foot-sep" />
        <span>Not affiliated with any game studio. Conversion rates are editable.</span>
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
        <h1 className="auth-title">{mode === 'signup' ? 'Sign up' : 'Sign in'}</h1>
        <p className="auth-sub">
          {mode === 'signup'
            ? 'Data is stored locally in your browser.'
            : 'Good to have you back.'}
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

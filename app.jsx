// App router. Handles screen state + localStorage persistence.
const { useState: useStateA, useEffect: useEffectA, Fragment } = React;

function App() {
  const params = new URLSearchParams(location.search);
  const themeName = params.get('theme') || 'lumen';
  window.__themeName = themeName;

  const storageKey = 'gachapull:' + themeName;

  const [store, setStore] = useStateA(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { user: null, games: [], prefs: {} };
  });

  const [screen, setScreen] = useStateA(() => {
    if (store.user && store.games.length) return 'dashboard';
    return 'landing';
  });

  const [authMode, setAuthMode] = useStateA('signup');

  useEffectA(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(store)); } catch {}
  }, [store]);

  useEffectA(() => {
    document.documentElement.setAttribute('data-theme', themeName);
    if (store.prefs?.accentHue) {
      document.documentElement.style.setProperty('--accent-hue', store.prefs.accentHue);
    }
  }, [themeName, store.prefs?.accentHue]);

  const goAuth = (mode) => { setAuthMode(mode); setScreen('auth'); };

  const handleAuth = (user) => {
    setStore((s) => ({ ...s, user }));
    setScreen(store.games.length ? 'dashboard' : 'onboarding');
  };

  const handleOnboard = ({ games }) => {
    setStore((s) => ({ ...s, games: games.map((g) => ({ ...g, snapshots: g.snapshots || [] })) }));
    setScreen('dashboard');
  };

  const handleDemo = () => {
    const hsr = window.PRESET_GAMES.find((g) => g.id === 'hsr');
    const snaps = window.generateSampleSnapshots(hsr, 7);
    setStore({
      user: { email: 'demo@lumen.app', name: 'Demo' },
      games: [{ ...hsr, latest: snaps[snaps.length - 1].counts, snapshots: snaps }],
      prefs: {},
    });
    setScreen('dashboard');
  };

  const signOut = () => {
    setStore({ user: null, games: [], prefs: store.prefs });
    setScreen('landing');
  };

  return (
    <Fragment>
      {screen === 'landing' && (
        <Landing themeName={themeName}
          onStart={() => goAuth('signup')}
          onSignIn={() => goAuth('signin')} />
      )}
      {screen === 'auth' && (
        <Auth mode={authMode}
          onComplete={handleAuth}
          onSwitchMode={setAuthMode}
          onBack={() => setScreen('landing')}
          onDemo={handleDemo} />
      )}
      {screen === 'onboarding' && (
        <Onboarding presets={window.PRESET_GAMES}
          onComplete={handleOnboard}
          onBack={() => setScreen('auth')} />
      )}
      {screen === 'dashboard' && store.games.length > 0 && (
        <Dashboard store={store} onUpdate={setStore}
          onSignOut={signOut}
          onOpenSettings={() => setScreen('settings')}
          themeName={themeName} />
      )}
      {screen === 'dashboard' && store.games.length === 0 && (
        <div className="empty">
          <h2>No games yet.</h2>
          <Button onClick={() => setScreen('onboarding')}>Add your first game</Button>
        </div>
      )}
      {screen === 'settings' && (
        <Settings store={store} onUpdate={setStore} onBack={() => setScreen('dashboard')} themeName={themeName} />
      )}
    </Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

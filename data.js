// Game presets + sample-data generator. Pure data + helpers. No React.
// Resource conversion: perPull = how many of this currency equals 1 pull.

window.PRESET_GAMES = [
  {
    id: 'arknights',
    name: 'Arknights',
    short: 'AK',
    hue: 215,
    bannerName: 'Limited Headhunting',
    bannerDaysFromNow: 18,
    resources: [
      { id: 'orundum', name: 'Orundum', perPull: 600, hint: '600 per pull', icon: 'gem' },
      { id: 'op', name: 'Originite Prime', perPull: 3.33, hint: '≈3.33 per pull', icon: 'gem-premium' },
      { id: 'permit', name: 'Headhunting Permit', perPull: 1, hint: '1 per pull', icon: 'ticket' },
      { id: 'distinction', name: 'Distinction Cert', perPull: 180, hint: '180 per pull (shop)', icon: 'cert' },
    ],
  },
  {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    short: 'HSR',
    hue: 285,
    bannerName: 'Character Event Warp',
    bannerDaysFromNow: 11,
    resources: [
      { id: 'jade', name: 'Stellar Jade', perPull: 160, hint: '160 per pull', icon: 'gem' },
      { id: 'shard', name: 'Oneiric Shard', perPull: 160, hint: '160 per pull', icon: 'shard' },
      { id: 'special_pass', name: 'Special Pass', perPull: 1, hint: '1 per pull', icon: 'ticket-premium' },
      { id: 'pass', name: 'Star Rail Pass', perPull: 1, hint: '1 per pull', icon: 'ticket' },
    ],
  },
  {
    id: 'blue_archive',
    name: 'Blue Archive',
    short: 'BA',
    hue: 195,
    bannerName: 'Pickup Recruitment',
    bannerDaysFromNow: 6,
    resources: [
      { id: 'pyroxene', name: 'Pyroxene', perPull: 120, hint: '120 per pull', icon: 'gem' },
      { id: 'recruit', name: 'Recruit Ticket', perPull: 1, hint: '1 per pull', icon: 'ticket' },
    ],
  },
  {
    id: 'umamusume',
    name: 'Umamusume',
    short: 'UMA',
    hue: 340,
    bannerName: 'Focus Scout',
    bannerDaysFromNow: 24,
    resources: [
      { id: 'carats', name: 'Carats', perPull: 150, hint: '150 per pull', icon: 'gem-premium' },
      { id: 'ticket', name: 'Single Pull Ticket', perPull: 1, hint: '1 per pull', icon: 'ticket' },
      { id: 'ticket10', name: '10-Pull Ticket', perPull: 0.1, hint: '1 = 10 pulls', icon: 'ticket-bundle' },
    ],
  },
  {
    id: 'pjsk',
    name: 'Project Sekai',
    short: 'PJSK',
    hue: 305,
    bannerName: 'Colorful Festival',
    bannerDaysFromNow: 9,
    resources: [
      { id: 'crystal', name: 'Crystals', perPull: 300, hint: '300 per pull', icon: 'gem' },
      { id: 'paid_crystal', name: 'Paid Crystals', perPull: 300, hint: '300 per pull', icon: 'gem-premium' },
      { id: 'bonds', name: 'Bonds Voucher', perPull: 1, hint: '1 per pull', icon: 'ticket' },
    ],
  },
  {
    id: 'limbus',
    name: 'Limbus Company',
    short: 'LCB',
    hue: 8,
    bannerName: 'Walpurgisnacht Banner',
    bannerDaysFromNow: 14,
    resources: [
      { id: 'lunacy', name: 'Lunacy', perPull: 130, hint: '130 per pull', icon: 'gem' },
      { id: 'extraction', name: 'Pierced Egg Ticket', perPull: 1, hint: '1 per pull', icon: 'ticket' },
      { id: 'module', name: 'Module Ticket', perPull: 1, hint: '1 per pull (EGO)', icon: 'ticket-premium' },
    ],
  },
  {
    id: 'stella_sora',
    name: 'Stella Sora',
    short: 'SS',
    hue: 245,
    bannerName: 'Limited Trekker Banner',
    bannerDaysFromNow: 21,
    resources: [
      { id: 'stellanite', name: 'Stellanite Dust', perPull: 300, hint: '300 per pull', icon: 'gem-premium' },
      { id: 'cerulean', name: 'Cerulean Ticket', perPull: 1, hint: '1 per pull (Trekker)', icon: 'ticket-premium' },
      { id: 'sprout', name: 'Sprout Ticket', perPull: 1, hint: '1 per pull (Standard)', icon: 'ticket' },
      { id: 'travel_permit', name: 'Travel Permit', perPull: 1500, hint: '1,500 per pull (shop)', icon: 'cert' },
    ],
  },
  {
    id: 'endfield',
    name: 'Arknights: Endfield',
    short: 'AKE',
    hue: 165,
    bannerName: 'Chartered Headhunting',
    bannerDaysFromNow: 27,
    resources: [
      { id: 'oroberyl', name: 'Oroberyl', perPull: 500, hint: '500 per pull', icon: 'gem' },
      { id: 'origeometry', name: 'Origeometry', perPull: 75, hint: '≈75 per pull (paid)', icon: 'gem-premium' },
      { id: 'hh_permit', name: 'Headhunting Permit', perPull: 1, hint: '1 per pull', icon: 'ticket-premium' },
      { id: 'arsenal', name: 'Arsenal Ticket', perPull: 198, hint: '≈198 per pull (weapon)', icon: 'cert' },
    ],
  },
  {
    id: 'nikke',
    name: 'NIKKE',
    short: 'NK',
    hue: 35,
    bannerName: 'SSR Pickup Recruit',
    bannerDaysFromNow: 5,
    resources: [
      { id: 'gems', name: 'Gems', perPull: 300, hint: '300 per pull', icon: 'gem-premium' },
      { id: 'ord_voucher', name: 'Ordinary Recruit Voucher', perPull: 1, hint: '1 per pull (Standard)', icon: 'ticket' },
      { id: 'adv_voucher', name: 'Advanced Recruit Voucher', perPull: 1, hint: '1 per pull (SSR)', icon: 'ticket-premium' },
    ],
  },
];

// Pull total in floating "pulls" given a resource map {resId: count}.
window.computePulls = function(resources, counts) {
  let total = 0;
  for (const r of resources) {
    const v = Number(counts[r.id] ?? 0);
    if (!isFinite(v)) continue;
    total += v / r.perPull;
  }
  return total;
};

// Seeded RNG so sample data is stable across reloads.
function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate 90 days of snapshots for a sample account.
// Models realistic gameplay: daily gain + occasional bursts (events, codes,
// monthly pass) and a couple of spending events (banner pulls).
window.generateSampleSnapshots = function(game, seed = 42) {
  const rng = mulberry32(seed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snapshots = [];
  // Initial state: a modestly-stocked account.
  const counts = {};
  for (const r of game.resources) {
    if (r.perPull >= 100) counts[r.id] = Math.floor(800 + rng() * 1200);
    else if (r.perPull <= 1) counts[r.id] = Math.floor(rng() * 12);
    else counts[r.id] = Math.floor(20 + rng() * 30);
  }
  // Walk forward 90 days, log every 3-5 days.
  let day = 90;
  while (day >= 0) {
    // Daily-ish income.
    for (const r of game.resources) {
      if (r.perPull >= 100) counts[r.id] += Math.floor(40 + rng() * 90);
      else if (r.perPull <= 1) {
        if (rng() < 0.25) counts[r.id] += 1;
      } else {
        if (rng() < 0.3) counts[r.id] += 1;
      }
    }
    // Occasional event burst.
    if (rng() < 0.08) {
      for (const r of game.resources) {
        if (r.perPull >= 100) counts[r.id] += Math.floor(500 + rng() * 1500);
        else if (r.perPull <= 1) counts[r.id] += Math.floor(2 + rng() * 5);
      }
    }
    // Occasional banner spend.
    if (rng() < 0.05 && day < 80) {
      for (const r of game.resources) {
        if (r.perPull >= 100) counts[r.id] = Math.max(0, counts[r.id] - Math.floor(3000 + rng() * 6000));
        else if (r.perPull === 1) counts[r.id] = Math.max(0, counts[r.id] - Math.floor(rng() * 8));
      }
    }
    const stamp = new Date(today.getTime() - day * 86400000);
    snapshots.push({
      ts: stamp.toISOString().slice(0, 10),
      counts: { ...counts },
      pulls: window.computePulls(game.resources, counts),
    });
    day -= 3 + Math.floor(rng() * 3);
  }
  return snapshots;
};

// Convenience: compute summary stats from a snapshot timeline.
window.computeStats = function(snapshots) {
  if (!snapshots.length) return { current: 0, weekly: 0, monthly: 0, deltaWeek: 0, deltaMonth: 0 };
  const last = snapshots[snapshots.length - 1];
  const current = last.pulls;
  // Find snapshot ~7d and ~30d ago.
  const dayMs = 86400000;
  const tNow = new Date(last.ts).getTime();
  const findClosest = (daysBack) => {
    let best = snapshots[0], bd = Infinity;
    for (const s of snapshots) {
      const d = Math.abs(tNow - new Date(s.ts).getTime() - daysBack * dayMs);
      if (d < bd) { bd = d; best = s; }
    }
    return best;
  };
  const a = findClosest(7), b = findClosest(30);
  const span = (tNow - new Date(snapshots[0].ts).getTime()) / dayMs || 1;
  const totalGain = Math.max(0, current - snapshots[0].pulls + estimateSpending(snapshots));
  const perDay = totalGain / span;
  return {
    current,
    deltaWeek: current - a.pulls,
    deltaMonth: current - b.pulls,
    weekly: perDay * 7,
    monthly: perDay * 30,
    perDay,
  };
};

// Detect drops (spending) between consecutive snapshots and sum them back in,
// so the gain rate isn't biased low by banner pulls.
function estimateSpending(snapshots) {
  let spent = 0;
  for (let i = 1; i < snapshots.length; i++) {
    const d = snapshots[i - 1].pulls - snapshots[i].pulls;
    if (d > 5) spent += d;
  }
  return spent;
}

// Forecast: at current daily gain rate, how many pulls by date X.
window.forecastBy = function(currentPulls, perDay, daysAhead) {
  return currentPulls + perDay * daysAhead;
};

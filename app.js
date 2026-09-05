/* PlayConnect — rendering logic. Reads DATA from data.js, writes nothing. */

function fieldById(id) { return DATA.fields.find(f => f.id === id); }
function teamById(id) { return DATA.teams.find(t => t.id === id); }

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function fmtTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const h12 = ((h + 11) % 12) + 1;
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, "0")}${period}`;
}

function sportLabel(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* Generic filter-bar setup. items = array of {sport}, onFilter(sport|null) redraws. */
function setupSportFilter(containerEl, items, onFilter) {
  const sports = [...new Set(items.map(i => i.sport))];
  containerEl.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.className = "active";
  containerEl.appendChild(allBtn);
  sports.forEach(s => {
    const btn = document.createElement("button");
    btn.textContent = sportLabel(s);
    containerEl.appendChild(btn);
  });
  containerEl.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      containerEl.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      onFilter(btn.textContent === "All" ? null : btn.textContent.toLowerCase());
    });
  });
}

/* ---------- Home page ---------- */
function renderHome() {
  const upcoming = DATA.matches
    .filter(m => m.status === "scheduled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  const el = document.getElementById("upcoming-list");
  if (!upcoming.length) {
    el.innerHTML = `<li class="empty">No matches scheduled yet. Check back soon, or add one in js/data.js.</li>`;
    return;
  }
  el.innerHTML = upcoming.map(m => {
    const a = teamById(m.teamAId), b = teamById(m.teamBId), f = fieldById(m.fieldId);
    return `
      <li class="sport-${a.sport}">
        <div class="row-top"><span>${fmtDate(m.date)} · ${fmtTime(m.time)}</span><span class="tag">${sportLabel(a.sport)}</span></div>
        <div class="row-main">${a.name} vs ${b.name}</div>
        <div class="row-sub">Field: ${f.name}</div>
      </li>`;
  }).join("");
}

/* ---------- Fields page ---------- */
function renderFields() {
  const listEl = document.getElementById("fields-list");
  const draw = (sport) => {
    const fields = sport ? DATA.fields.filter(f => f.sport === sport) : DATA.fields;
    listEl.innerHTML = fields.map(f => `
      <li class="sport-${f.sport}">
        <div class="row-top"><span>${f.location}</span><span class="tag">${sportLabel(f.sport)}</span></div>
        <div class="row-main">${f.name}</div>
        <div class="row-sub">${f.condition}</div>
      </li>`).join("") || `<li class="empty">No fields listed for this sport yet.</li>`;
  };
  setupSportFilter(document.getElementById("field-filters"), DATA.fields, draw);
  draw(null);
}

/* ---------- Teams page ---------- */
function renderTeams() {
  const listEl = document.getElementById("teams-list");
  const draw = (sport) => {
    const teams = sport ? DATA.teams.filter(t => t.sport === sport) : DATA.teams;
    listEl.innerHTML = teams.map(t => {
      const home = fieldById(t.homeFieldId);
      return `
        <li class="sport-${t.sport}">
          <div class="row-top"><span>Captain: ${t.captain}</span><span class="tag">${sportLabel(t.sport)}</span></div>
          <div class="row-main">${t.name}</div>
          <div class="row-sub">Home field: ${home ? home.name : "—"} · Contact: ${t.contact}</div>
        </li>`;
    }).join("") || `<li class="empty">No teams registered for this sport yet.</li>`;
  };
  setupSportFilter(document.getElementById("team-filters"), DATA.teams, draw);
  draw(null);
}

/* ---------- Matches page ---------- */
function renderMatches() {
  const listEl = document.getElementById("matches-list");
  const sorted = [...DATA.matches].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const draw = (sport) => {
    const matches = sorted.filter(m => !sport || teamById(m.teamAId).sport === sport);
    listEl.innerHTML = matches.map(m => {
      const a = teamById(m.teamAId), b = teamById(m.teamBId), f = fieldById(m.fieldId);
      return `
        <li class="sport-${a.sport}">
          <div class="row-top"><span>${fmtDate(m.date)} · ${fmtTime(m.time)}</span><span class="status-${m.status}">${m.status}</span></div>
          <div class="row-main">${a.name} vs ${b.name}</div>
          <div class="row-sub">Field: ${f.name}${m.notes ? " · " + m.notes : ""}</div>
        </li>`;
    }).join("") || `<li class="empty">No matches for this sport yet.</li>`;
  };
  setupSportFilter(document.getElementById("match-filters"), DATA.teams, draw);
  draw(null);
}

/* ---------- Results & standings page ---------- */
function renderResults() {
  const resultsListEl = document.getElementById("results-list");
  const completed = DATA.matches
    .filter(m => m.status === "completed")
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  resultsListEl.innerHTML = completed.map(m => {
    const r = DATA.results.find(res => res.matchId === m.id);
    const a = teamById(m.teamAId), b = teamById(m.teamBId);
    if (!r) return "";
    return `
      <li class="sport-${a.sport}">
        <div class="row-top"><span>${fmtDate(m.date)}</span><span class="tag">${sportLabel(a.sport)}</span></div>
        <div class="row-main">${a.name} ${r.scoreA} — ${r.scoreB} ${b.name}</div>
      </li>`;
  }).join("") || `<li class="empty">No results recorded yet.</li>`;

  renderStandings();
}

function renderStandings() {
  const container = document.getElementById("standings-tables");
  const sports = [...new Set(DATA.teams.map(t => t.sport))];
  container.innerHTML = sports.map(sport => {
    const table = {};
    DATA.teams.filter(t => t.sport === sport).forEach(t => {
      table[t.id] = { name: t.name, played: 0, won: 0, drawn: 0, lost: 0, points: 0 };
    });
    DATA.matches.filter(m => m.status === "completed").forEach(m => {
      const r = DATA.results.find(res => res.matchId === m.id);
      if (!r || !table[m.teamAId] || !table[m.teamBId]) return;
      const a = table[m.teamAId], b = table[m.teamBId];
      a.played++; b.played++;
      if (r.scoreA > r.scoreB) { a.won++; a.points += 3; b.lost++; }
      else if (r.scoreA < r.scoreB) { b.won++; b.points += 3; a.lost++; }
      else { a.drawn++; b.drawn++; a.points++; b.points++; }
    });
    const rows = Object.values(table).sort((x, y) => y.points - x.points);
    const rowsHtml = rows.map(r => `
      <tr><td>${r.name}</td><td>${r.played}</td><td>${r.won}</td><td>${r.drawn}</td><td>${r.lost}</td><td>${r.points}</td></tr>
    `).join("");
    return `
      <h2>${sportLabel(sport)} standings</h2>
      <table class="standings">
        <thead><tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>`;
  }).join("");
}

/*
  PlayConnect data file
  ----------------------
  This is the whole "database" for the site. To update PlayConnect,
  edit the lists below and push the change to GitHub — no coding needed
  beyond copying the pattern of an existing entry.

  Dates use the format "YYYY-MM-DD" and times use 24-hour "HH:MM".
  Sport values must be exactly: "football", "basketball", or "volleyball"
  (add a new sport by adding it here and in css/style.css + js/app.js).
*/

const DATA = {

  fields: [
    { id: "f1", name: "Village 3 Pitch",   sport: "football",   location: "Village 3, near the borehole", condition: "Open, some uneven patches" },
    { id: "f2", name: "Zone 2 Court",       sport: "basketball", location: "Zone 2, next to the school",   condition: "Open" },
    { id: "f3", name: "Reception Ground",   sport: "volleyball", location: "Near Reception Centre",         condition: "Open" },
    { id: "f4", name: "Village 1 Pitch",    sport: "football",   location: "Village 1",                     condition: "Reduced — new housing on east side" },
  ],

  teams: [
    { id: "t1", name: "Green Warriors",     sport: "football",   captain: "Peter Lomong",  contact: "07xx xxx xxx", homeFieldId: "f1" },
    { id: "t2", name: "Kalobeyei FC",       sport: "football",   captain: "Aggrey Deng",   contact: "07xx xxx xxx", homeFieldId: "f4" },
    { id: "t3", name: "Riverside Ballers",  sport: "basketball", captain: "Mary Nyibol",   contact: "07xx xxx xxx", homeFieldId: "f2" },
    { id: "t4", name: "Unity BC",           sport: "basketball", captain: "James Kenyi",   contact: "07xx xxx xxx", homeFieldId: "f2" },
    { id: "t5", name: "Kalobeyei Spikers",  sport: "volleyball", captain: "Grace Achol",   contact: "07xx xxx xxx", homeFieldId: "f3" },
  ],

  // status: "scheduled", "completed", or "cancelled"
  matches: [
    { id: "m1", date: "2026-09-06", time: "16:00", fieldId: "f1", teamAId: "t1", teamBId: "t2", status: "scheduled", notes: "" },
    { id: "m2", date: "2026-09-07", time: "10:00", fieldId: "f2", teamAId: "t3", teamBId: "t4", status: "scheduled", notes: "" },
    { id: "m3", date: "2026-08-30", time: "15:00", fieldId: "f1", teamAId: "t1", teamBId: "t2", status: "completed", notes: "" },
  ],

  // one entry per completed match, linked by matchId
  results: [
    { matchId: "m3", scoreA: 2, scoreB: 1 },
  ],

};

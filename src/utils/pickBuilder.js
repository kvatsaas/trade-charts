import draftRoundsData from '../data/draftRounds.json';

// Get round cutoffs for current year (default to 2026)
const currentYear = 2026;
const futureYearsAllowed = 2;
const roundCutoffs = draftRoundsData[currentYear.toString()];

// Format pick number with round information (e.g., "5 (1.5)")
export function buildPick(pickId) {
  let mrIrrelevant = roundCutoffs[roundCutoffs.length - 1];
  let pickRound = 1;
  let futureYears = Math.floor((pickId - 1) / mrIrrelevant);
  let pickInYear = ((pickId - 1) % mrIrrelevant) + 1;
  let pickInRound = pickInYear;
  
  for (let i = 0; i < roundCutoffs.length; i++) {
    if (pickInYear <= roundCutoffs[i]) {
      pickRound = i + 1;
      const previousCutoff = i > 0 ? roundCutoffs[i - 1] : 0;
      pickInRound = pickInYear - previousCutoff;
      break;
    }
  }

  const pick = {
    id: pickId,
    year: currentYear + futureYears,
    yearsAhead: futureYears,
    number: pickInYear,
    round: pickRound,
    roundPick: pickInRound
  }
  pick.formatted = `${pick.year} #${pick.number} (${pick.round}.${pick.roundPick})`

  return pick;
}
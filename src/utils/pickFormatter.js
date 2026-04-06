import draftRoundsData from '../data/draftRounds.json';

// Get round cutoffs for current year (default to 2026)
const roundCutoffs = draftRoundsData['2026'];

// Format pick number with round information (e.g., "5 (1.5)")
export function formatPickNumber(pickNumber) {
  let round = 1;
  let pickInRound = pickNumber;
  
  for (let i = 0; i < roundCutoffs.length; i++) {
    if (pickNumber <= roundCutoffs[i]) {
      round = i + 1;
      const previousCutoff = i > 0 ? roundCutoffs[i - 1] : 0;
      pickInRound = pickNumber - previousCutoff;
      break;
    }
  }
  
  return `#${pickNumber} (${round}.${pickInRound})`;
}

// Get max pick number
export function getMaxPickNumber() {
  return roundCutoffs[roundCutoffs.length - 1];
}
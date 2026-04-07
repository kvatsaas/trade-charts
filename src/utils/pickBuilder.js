import draftRoundsData from '../data/draftRounds.json';
import inventory from '../data/inventory.json'

const currentYear = 2026;
const roundCutoffs = draftRoundsData[currentYear.toString()];

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
    roundPick: pickInRound,
  }
  pick.currentOwner = futureYears ? null : inventory[pick.year].order[pick.number].current;
  let previous = futureYears ? null : inventory[pick.year].order[pick.number].previous.length;
  pick.previousOwners = previous && previous.length ? previous : null;
  pick.formattedNoYear = `#${pick.number} (${pick.round}.${pick.roundPick.toString().padStart(2, '0')})`;
  pick.formatted = `${pick.year} ${pick.formattedNoYear}`;

  return pick;
}
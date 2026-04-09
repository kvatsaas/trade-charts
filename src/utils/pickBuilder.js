import draftRoundsData from '../data/draftRounds.json';
import inventory from '../data/inventory.json'

const currentYear = 2026;
const futureYearsAllowed = 3;
const roundCutoffs = draftRoundsData[currentYear.toString()];

export function buildPick(pickId) {
  let mrIrrelevant = roundCutoffs[roundCutoffs.length - 1];
  let pickRound = 1;
  let futureYears = Math.floor((pickId - 1) / mrIrrelevant);
  let pickInYear = ((pickId - 1) % mrIrrelevant) + 1;
  let pickInRound = pickInYear;
  
  for (let i = 1; i < roundCutoffs.length; i++) {
    if (pickInYear <= roundCutoffs[i]) {
      pickRound = i;
      pickInRound = pickInYear - roundCutoffs[pickRound - 1];
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

export function buildPickFromParamString(p) {
  console.log("hi")
  console.log(p)
  const values = p.split('.');
  if (values.length < 2 || values.length > 3) {
    return null;
  }

  const yearDiff = parseInt(values[0]) - currentYear;
  if (yearDiff < 0 || yearDiff > futureYearsAllowed) {
    return null;
  }

  let pickId;
  // should eventually update to use individual values for all years
  if (values.length == 2) {
    pickId = parseInt(values[1]) + (yearDiff * 257);
  } else {
    const round = parseInt(values[1]);
    const pickInRound = parseInt(values[2]);
    console.log(yearDiff)
    console.log(yearDiff * 257)
    console.log(values)
    console.log(round)
    console.log(pickInRound)

    pickId = roundCutoffs[round - 1] + pickInRound + (yearDiff * 257);
  }
  console.log(pickId)
  if (pickId < 1 || pickId > (futureYearsAllowed + 1) * 257) {
    console.log("yeet")
    return null;
  } else {
  console.log("bye")
    return buildPick(pickId);
  }
}

export function pickIdToParamString(p) {
  return `${p.year}.${p.number}`;
}
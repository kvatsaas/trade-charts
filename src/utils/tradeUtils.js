// Calculate trade values and assessment
export function calculateTradeValues(teamAPicks, teamBPicks, chartValues, teamAName, teamBName) {
  if (teamAPicks.length === 0 || teamBPicks.length === 0) {
    return null;
  }

  // Use proper rounding to avoid floating point errors
  const roundValue = (val) => Math.round(val * 100) / 100;
  
  const teamAGiving = roundValue(teamAPicks.reduce((sum, pick) => sum + getPickValue(pick, chartValues), 0));
  const teamBGiving = roundValue(teamBPicks.reduce((sum, pick) => sum + getPickValue(pick, chartValues), 0));
  
  const difference = roundValue(Math.abs(teamAGiving - teamBGiving));
  const smallerValue = Math.min(teamAGiving, teamBGiving);
  const percentage = smallerValue > 0 ? roundValue((difference / smallerValue) * 100) : 0;
  
  // Generate assessment text using actual team names
  // The team giving MORE is overpaying
  let assessment = '';
  if (difference === 0) {
    assessment = 'Equal trade';
  } else {
    const overpayingTeam = teamAGiving > teamBGiving ? teamAName : teamBName;
    assessment = `${overpayingTeam} overpaying by ${percentage.toFixed(1)}%`;
  }
  
  return {
    teamAGiving,
    teamBGiving,
    difference,
    percentage,
    assessment
  };
}

// Find the pick(s) closest in value to the given difference
export function findClosestPick(difference, chartValues) {
  if (difference === 0) {
    return null;
  }
  
  // Check if difference is greater than the #1 pick value
  if (difference > chartValues[1]) {
    return {
      picks: null,
      value: chartValues[1],
      greaterThanFirst: true
    };
  }
  
  // Check if difference is less than the last pick value
  if (difference < chartValues[chartValues.length - 1]) {
    return {
      picks: null,
      value: chartValues[chartValues.length - 1],
      lessThanLast: true
    };
  }
  
  let closestPick = null;
  let left = 1;
  let right = chartValues.length - 1;

  // binary search for exact value
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (chartValues[mid] === difference) {
      closestPick = mid;
      break;
    } else if (chartValues[mid] > difference) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // if no exact match, find the closest value
  if (closestPick === null) {
    closestPick = (Math.abs(chartValues[left] - difference) <= Math.abs(chartValues[right] - difference)) ? left : right;
  }
  
  // check for neighboring matches
  left = closestPick;
  right = closestPick;
  while (left > 1) {
    if (chartValues[left - 1] == chartValues[closestPick]) {
      left--;
    } else {
      break;
    }
  }
  while (right < chartValues.length - 1) {
    if (chartValues[right + 1] == chartValues[closestPick]) {
      right++;
    } else {
      break;
    }
  }
  if (left == right) {
    return {
      picks: [closestPick],
      value: chartValues[closestPick],
      isRange: false
    }
  } else {
    return {
      picks: [left, right],
      value: chartValues[closestPick],
      isRange: true
    }
  }
}

// Get individual pick values for display
export function getPickValues(picks, chartValues) {
  return picks.map(pick => ({
    pick,
    value: getPickValue(pick, chartValues)
  }));
}

function getPickValue(pick, chartValues) {
  let adjustedPick = pick.number + (pick.yearsAhead * 32);
  return chartValues[Math.min(adjustedPick, chartValues.length - 1)];
}
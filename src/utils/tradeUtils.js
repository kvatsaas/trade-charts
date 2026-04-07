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
  const firstPickValue = chartValues[0];
  if (difference > firstPickValue) {
    return {
      picks: null,
      value: firstPickValue,
      greaterThanFirst: true
    };
  }
  
  let closestDiff = Infinity;
  let closestPicks = [];
  
  chartValues.forEach((value, index) => {
    const diff = Math.abs(value - difference);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestPicks = [index + 1];
    } else if (diff === closestDiff) {
      closestPicks.push(index + 1);
    }
  });
  
  // If multiple picks have the same value, return as a range
  if (closestPicks.length > 1) {
    // Check if they're all the same value
    const firstValue = chartValues[closestPicks[0] - 1];
    const allSameValue = closestPicks.every(pick => getPickValue(pick, chartValues) === firstValue);
    
    if (allSameValue) {
      return {
        picks: closestPicks,
        value: firstValue,
        isRange: true
      };
    }
  }
  
  // Return the highest pick if there are two equally close
  return {
    picks: [Math.min(...closestPicks)],
    value: chartValues[Math.min(...closestPicks) - 1],
    isRange: false
  };
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
  return chartValues[Math.min(adjustedPick - 1, chartValues.length - 1)];
}
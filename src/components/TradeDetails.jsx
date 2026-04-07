import { getPickValues, findClosestPick } from '../utils/tradeUtils';
import { buildPick } from '../utils/pickBuilder';
import { formatNumber } from '../utils/formatNumber';

function TradeDetails({ 
  teamAPicks, 
  teamBPicks, 
  tradeValues, 
  chartValues,
  teamALocation,
  teamBLocation,
  teamAName,
  teamBName
}) {
  const teamAPickValues = getPickValues(teamAPicks, chartValues);
  const teamBPickValues = getPickValues(teamBPicks, chartValues);
  const closestPick = findClosestPick(tradeValues.difference, chartValues);

  return (
    <div className="trade-details">
      <div className="details-section">
        <h4>{teamALocation != "" ? teamALocation : teamAName} sends:</h4>
        <ul>
          {teamAPickValues.map(({ pick, value }) => (
            <li key={pick.id}>{pick.formatted}: {formatNumber(value)}</li>
          ))}
        </ul>
        <div className="total">Total: {formatNumber(tradeValues.teamAGiving)}</div>
      </div>

      <div className="details-section">
        <h4>{teamBLocation != "" ? teamBLocation : teamBName} sends:</h4>
        <ul>
          {teamBPickValues.map(({ pick, value }) => (
            <li key={pick.id}>{pick.formatted}: {formatNumber(value)}</li>
          ))}
        </ul>
        <div className="total">Total: {formatNumber(tradeValues.teamBGiving)}</div>
      </div>

      <div className="details-section difference-section">
        <h4>Difference:</h4>
        <div>
          Value: {formatNumber(tradeValues.difference)} ({tradeValues.percentage.toFixed(1)}%)
        </div>
        {closestPick && (
          <div className="closest-pick">
            {closestPick.greaterThanFirst ? (
              `Greater than the #1 pick (${closestPick.value})`
            ) : closestPick.isRange ? (
              `Closest: ${buildPick(Math.min(...closestPick.picks)).formatted}-${buildPick(Math.max(...closestPick.picks)).formatted} - ${closestPick.value}`
            ) : (
              `Closest: ${buildPick(closestPick.picks[0]).formatted} - ${closestPick.value}`
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TradeDetails;
import { useState } from 'react';
import { calculateTradeValues } from '../utils/tradeUtils';
import { formatNumber } from '../utils/formatNumber';
import InfoTooltip from './InfoTooltip';
import TradeValueBar from './TradeValueBar';
import TradeDetails from './TradeDetails';

function TradeChartCard({ 
  chart, 
  teamAPicks, 
  teamBPicks, 
  teamAData, 
  teamBData 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tradeValues = calculateTradeValues(teamAPicks, teamBPicks, chart.values, teamAData.name, teamBData.name);

  if (!tradeValues) {
    return (
      <div className="trade-chart-card">
        <div className="chart-header">
          <h3>{chart.name}</h3>
          <InfoTooltip description={chart.description} url={chart.infoUrl} />
        </div>
        <div className="chart-empty">Select picks for both teams to see results</div>
      </div>
    );
  }

  return (
    <div className="trade-chart-card">
      <div className="chart-header">
        <h3>{chart.name}</h3>
        <InfoTooltip description={chart.description} url={chart.infoUrl} />
      </div>

      <div className="chart-content">
        <div className="trade-summary">
          <div className="team-value left" style={{ color: teamAData.primaryColor }}>
            <div className="team-name">{teamAData.location} {teamAData.name}</div>
            <div className="team-total">{formatNumber(tradeValues.teamAGiving)}</div>
          </div>

          <div className="trade-assessment">
            {tradeValues.assessment}
          </div>

          <div className="team-value right" style={{ color: teamBData.primaryColor }}>
            <div className="team-name">{teamBData.location} {teamBData.name}</div>
            <div className="team-total">{formatNumber(tradeValues.teamBGiving)}</div>
          </div>
        </div>

        <TradeValueBar
          teamAGiving={tradeValues.teamAGiving}
          teamBGiving={tradeValues.teamBGiving}
          teamAColor={teamAData.primaryColor}
          teamBColor={teamBData.primaryColor}
        />

        <button 
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲ Hide Details' : '▼ Show Details'}
        </button>

        {isExpanded && (
          <TradeDetails
            teamAPicks={teamAPicks}
            teamBPicks={teamBPicks}
            tradeValues={tradeValues}
            chartValues={chart.values}
            teamALocation={teamAData.location}
            teamBLocation={teamBData.location}
          />
        )}
      </div>
    </div>
  );
}

export default TradeChartCard;
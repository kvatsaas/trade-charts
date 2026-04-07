import { useState } from 'react';
import tradeChartsData from './data/tradeCharts.json';
import { nflTeams } from './data/nflTeams';
import TeamSelector from './components/TeamSelector';
import PickSelector from './components/PickSelector';
import SelectedPicks from './components/SelectedPicks';
import TradeChartCard from './components/TradeChartCard';
import SettingsModal from './components/SettingsModal';
import './App.css';

function App() {
  const [teamAId, setTeamAId] = useState('default-a');
  const [teamBId, setTeamBId] = useState('default-b');
  const [teamAPicks, setTeamAPicks] = useState([]);
  const [teamBPicks, setTeamBPicks] = useState([]);
  const [visibleCharts, setVisibleCharts] = useState(
    tradeChartsData.charts.map(c => c.id)
  );
  const [chartOrder, setChartOrder] = useState(
    tradeChartsData.charts.map(c => c.id)
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const teamAData = nflTeams.find(t => t.id === teamAId);
  const teamBData = nflTeams.find(t => t.id === teamBId);

  const allSelectedPicks = [...teamAPicks, ...teamBPicks].map(pick => pick.id);

  const handleAddPickTeamA = (pick) => {
    if (!teamAPicks.includes(pick)) {
      setTeamAPicks([...teamAPicks, pick]);
    }
  };

  const handleAddPickTeamB = (pick) => {
    if (!teamBPicks.includes(pick)) {
      setTeamBPicks([...teamBPicks, pick]);
    }
  };

  const handleRemovePickTeamA = (pick) => {
    setTeamAPicks(teamAPicks.filter(p => p !== pick));
  };

  const handleRemovePickTeamB = (pick) => {
    setTeamBPicks(teamBPicks.filter(p => p !== pick));
  };

  const handleClearAllTeamA = () => {
    setTeamAPicks([]);
  };

  const handleClearAllTeamB = () => {
    setTeamBPicks([]);
  };

  const handleToggleChart = (chartId) => {
    if (visibleCharts.includes(chartId)) {
      // Only allow hiding if there's more than one visible chart
      if (visibleCharts.length > 1) {
        setVisibleCharts(visibleCharts.filter(id => id !== chartId));
      }
    } else {
      setVisibleCharts([...visibleCharts, chartId]);
    }
  };

  const handleMoveChart = (chartId, direction) => {
    const currentIndex = chartOrder.indexOf(chartId);
    if (direction === 'up' && currentIndex > 0) {
      const newOrder = [...chartOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = 
        [newOrder[currentIndex - 1], newOrder[currentIndex]];
      setChartOrder(newOrder);
    } else if (direction === 'down' && currentIndex < chartOrder.length - 1) {
      const newOrder = [...chartOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = 
        [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setChartOrder(newOrder);
    }
  };

  const visibleChartsInOrder = chartOrder
    .filter(id => visibleCharts.includes(id))
    .map(id => tradeChartsData.charts.find(c => c.id === id));

  return (
    <div className="app">
      <header className="app-header">
        <h1>NFL Draft Trade Calculator</h1>
        <button 
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
          title="Chart Settings"
        >
          ⚙️
        </button>
      </header>

      <div className="trade-setup">
        <div className="team-section team-a">
          <TeamSelector
            value={teamAId}
            onChange={setTeamAId}
            side="A"
          />
          <PickSelector
            onAddPick={handleAddPickTeamA}
            excludedPicks={allSelectedPicks}
          />
          <SelectedPicks
            picks={teamAPicks}
            onRemovePick={handleRemovePickTeamA}
            onClearAll={handleClearAllTeamA}
            teamColor={teamAData.primaryColor}
          />
        </div>

        <div className="team-section team-b">
          <TeamSelector
            value={teamBId}
            onChange={setTeamBId}
            side="B"
          />
          <PickSelector
            onAddPick={handleAddPickTeamB}
            excludedPicks={allSelectedPicks}
          />
          <SelectedPicks
            picks={teamBPicks}
            onRemovePick={handleRemovePickTeamB}
            onClearAll={handleClearAllTeamB}
            teamColor={teamBData.primaryColor}
          />
        </div>
      </div>

      <div className="trade-charts">
        {visibleChartsInOrder.map(chart => (
          <TradeChartCard
            key={chart.id}
            chart={chart}
            teamAPicks={teamAPicks}
            teamBPicks={teamBPicks}
            teamAData={teamAData}
            teamBData={teamBData}
          />
        ))}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        charts={tradeChartsData.charts}
        visibleCharts={visibleCharts}
        chartOrder={chartOrder}
        onToggleChart={handleToggleChart}
        onMoveChart={handleMoveChart}
      />
    </div>
  );
}

export default App;
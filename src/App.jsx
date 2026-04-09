import { useEffect, useState } from 'react';
import { buildPickFromParamString, pickIdToParamString } from './utils/pickBuilder';
import tradeChartsData from './data/tradeCharts.json';
import nflTeams from './data/nflTeams.json';
import TeamSelector from './components/TeamSelector';
import PickSelector from './components/PickSelector';
import SelectedPicks from './components/SelectedPicks';
import TradeChartCard from './components/TradeChartCard';
import SettingsModal from './components/SettingsModal';
import ShareTradeButton from './components/ShareTradeButton';
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

  useEffect(() => {
    // handle search params
    const searchParams = new URLSearchParams(window.location.search);
    const paramAPicks = [];
    const paramBPicks = [];
    if (searchParams.size > 0) {
      if (searchParams.has('teama') && nflTeams.some(t => t.id === searchParams.get('teama'))) {
        setTeamAId(searchParams.get('teama'));
      }
      if (searchParams.has('teamb') && nflTeams.some(t => t.id === searchParams.get('teamb'))) {
        setTeamBId(searchParams.get('teamb'));
      }
      searchParams.getAll('a').forEach(a => {
        let pick = buildPickFromParamString(a);
        if (pick !== null && !paramAPicks.some(p => p.id === pick.id)) {
          paramAPicks.push(pick);
        }
      });
      searchParams.getAll('b').forEach(b => {
        let pick = buildPickFromParamString(b);
        if (pick !== null && !paramBPicks.some(p => p.id === pick.id)) {
          paramBPicks.push(pick);
        }
      });;
      setTeamAPicks([...paramAPicks]);
      setTeamBPicks([...paramBPicks]);
      const url = new URL(window.location);
      url.search = ""; // Clear parameters
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [])

  const teamAData = nflTeams.find(t => t.id === teamAId);
  const teamBData = nflTeams.find(t => t.id === teamBId);

  const allSelectedPicks = [...teamAPicks, ...teamBPicks].map(pick => pick.id);

  const handleAddPickTeamA = (pick) => {
    if (!teamAPicks.includes(pick) && !teamBPicks.includes(pick)) {
      setTeamAPicks([...teamAPicks, pick]);
    }
  };

  const handleAddPickTeamB = (pick) => {
    if (!teamBPicks.includes(pick) && !teamAPicks.includes(pick)) {
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

  const buildShareTradeLink = () => {
    const aPicks = teamAPicks.map(a => `a=${pickIdToParamString(a)}`).join('&');
    const bPicks = teamBPicks.map(b => `b=${pickIdToParamString(b)}`).join('&');
    console.log(`${window.location.href}?teama=${teamAId}&teamb=${teamBId}&${aPicks}&${bPicks}`);
    return `${window.location.href}?teama=${teamAId}&teamb=${teamBId}&${aPicks}&${bPicks}`;
  }

  const visibleChartsInOrder = chartOrder
    .filter(id => visibleCharts.includes(id))
    .map(id => tradeChartsData.charts.find(c => c.id === id));

  return (
    <div className="app">
      <header className="app-header">
        <h1>NFL Draft Trade Calculator</h1>
        <div className="header-actions">
          <ShareTradeButton
            buildLink={buildShareTradeLink}
            active={teamAPicks.length > 0 && teamBPicks.length > 0}
          />
          <button
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      <div className="trade-setup">
        <div className="team-section team-a">
          <TeamSelector
            value={teamAId}
            otherValue={teamBId}
            onChange={setTeamAId}
            side="A"
          />
          <PickSelector
            onAddPick={handleAddPickTeamA}
            excludedPicks={allSelectedPicks}
            selectedTeamId={teamAId}
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
            otherValue={teamAId}
            onChange={setTeamBId}
            side="B"
          />
          <PickSelector
            onAddPick={handleAddPickTeamB}
            excludedPicks={allSelectedPicks}
            selectedTeamId={teamBId}
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
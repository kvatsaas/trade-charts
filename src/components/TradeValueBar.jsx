function TradeValueBar({ teamAGiving, teamBGiving, teamAColor, teamBColor }) {
  const total = teamAGiving + teamBGiving;
  const teamAPercentage = total > 0 ? (teamAGiving / total) * 100 : 50;
  const teamBPercentage = total > 0 ? (teamBGiving / total) * 100 : 50;

  return (
    <div className="trade-value-bar">
      <div
        className="bar-segment team-a"
        style={{
          width: `${teamAPercentage}%`,
          backgroundColor: teamAColor
        }}
      />
      <div
        className="bar-segment team-b"
        style={{
          width: `${teamBPercentage}%`,
          backgroundColor: teamBColor
        }}
      />
    </div>
  );
}

export default TradeValueBar;
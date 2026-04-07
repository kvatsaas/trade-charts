function SelectedPicks({ picks, onRemovePick, onClearAll, teamColor }) {
  const sortedPicks = [...picks].sort((a, b) => a - b);
  const showClearButton = picks.length >= 2;

  return (
    <div className="selected-picks-container">
      <div className="selected-picks">
        {sortedPicks.map(pick => (
          <button
            key={pick.id}
            className="pick-tag"
            style={{ borderColor: teamColor }}
            onClick={() => onRemovePick(pick)}
            title="Click to remove"
          >
            {pick.formatted}
            <span className="remove-icon">×</span>
          </button>
        ))}
      </div>
      {showClearButton && (
        <button 
          className="clear-picks-button"
          onClick={onClearAll}
          title="Clear picks"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default SelectedPicks;
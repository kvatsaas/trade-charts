function SettingsModal({ 
  isOpen, 
  onClose, 
  charts, 
  visibleCharts, 
  chartOrder, 
  onToggleChart, 
  onMoveChart 
}) {
  if (!isOpen) return null;

  const orderedCharts = chartOrder.map(id => charts.find(c => c.id === id));
  const visibleCount = visibleCharts.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chart Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="settings-hint">At least one chart must be visible</p>
          {orderedCharts.map((chart, index) => {
            const isVisible = visibleCharts.includes(chart.id);
            const canHide = visibleCount > 1 || !isVisible;
            const isFirst = index === 0;
            const isLast = index === orderedCharts.length - 1;

            return (
              <div key={chart.id} className="chart-setting-row">
                <input
                  type="checkbox"
                  id={`chart-${chart.id}`}
                  checked={isVisible}
                  onChange={() => onToggleChart(chart.id)}
                  disabled={!canHide}
                />
                <label htmlFor={`chart-${chart.id}`}>{chart.name}</label>
                
                <div className="order-buttons">
                  <button
                    onClick={() => onMoveChart(chart.id, 'up')}
                    disabled={isFirst}
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => onMoveChart(chart.id, 'down')}
                    disabled={isLast}
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
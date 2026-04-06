import { useState } from 'react';

function InfoTooltip({ description, url }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="info-tooltip-container">
      <button
        className="info-icon"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        aria-label="More information"
      >
        ⓘ
      </button>
      {showTooltip && (
        <div className="tooltip">
          {description}
        </div>
      )}
    </div>
  );
}

export default InfoTooltip;
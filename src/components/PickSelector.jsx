import { useState, useRef, useEffect } from 'react';
import { buildPick } from '../utils/pickBuilder';

function PickSelector({ onAddPick, excludedPicks }) {
  const [searchValue, setSearchValue] = useState('');
  const [filteredPicks, setFilteredPicks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const futureYearsAllowed = 2;
  // Generate all picks 1-257
  const allPicks = Array.from({ length: 257 * (1 + futureYearsAllowed) }, (_, i) => buildPick(i + 1));

  useEffect(() => {
    if (searchValue) {
      const available = allPicks.filter(pick => 
        !excludedPicks.includes(pick.id) && 
        pick.formatted.includes(searchValue)
      );
      setFilteredPicks(available);
      setShowDropdown(available.length > 0);
      setSelectedIndex(0);
    } else {
      setFilteredPicks([]);
      setShowDropdown(false);
    }
  }, [searchValue, excludedPicks]);

  const handleAddPick = (pick) => {
    onAddPick(pick);
    setSearchValue('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredPicks.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPicks[selectedIndex]) {
        handleAddPick(filteredPicks[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="pick-selector">
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => searchValue && setShowDropdown(filteredPicks.length > 0)}
        placeholder="Type pick number..."
        className="pick-input"
      />
      {showDropdown && (
        <div className="pick-dropdown">
          {filteredPicks.map((pick, index) => (
            <div
              key={pick.id}
              className={`pick-option ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleAddPick(pick)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {pick.formatted}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PickSelector;
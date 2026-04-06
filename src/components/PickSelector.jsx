import { useState, useRef, useEffect } from 'react';
import { formatPickNumber } from '../utils/pickFormatter';

function PickSelector({ onAddPick, excludedPicks }) {
  const [inputValue, setInputValue] = useState('');
  const [filteredPicks, setFilteredPicks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Generate all picks 1-257
  const allPicks = Array.from({ length: 257 }, (_, i) => i + 1);

  useEffect(() => {
    if (inputValue) {
      // Remove # character if present for filtering
      const searchValue = inputValue.replace(/^#/, '');
      
      if (searchValue) {
        const available = allPicks.filter(pick => 
          !excludedPicks.includes(pick) && 
          pick.toString().startsWith(searchValue)
        );
        setFilteredPicks(available);
        setShowDropdown(available.length > 0);
        setSelectedIndex(0);
      } else {
        setFilteredPicks([]);
        setShowDropdown(false);
      }
    } else {
      setFilteredPicks([]);
      setShowDropdown(false);
    }
  }, [inputValue, excludedPicks]);

  const handleAddPick = (pick) => {
    onAddPick(pick);
    setInputValue('');
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
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue && setShowDropdown(filteredPicks.length > 0)}
        placeholder="Type pick number..."
        className="pick-input"
      />
      {showDropdown && (
        <div className="pick-dropdown">
          {filteredPicks.map((pick, index) => (
            <div
              key={pick}
              className={`pick-option ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleAddPick(pick)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {formatPickNumber(pick)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PickSelector;
import { useState, useRef, useEffect } from 'react';
import nflTeams from '../data/nflTeams.json';

function TeamSelector({ value, onChange, side }) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Filter teams based on side - only show Team A on left, Team B on right
  const availableTeams = side === 'A' 
    ? nflTeams.filter(t => t.id !== 'default-b')
    : nflTeams.filter(t => t.id !== 'default-a');

  // Get current team name for display (location + name)
  const currentTeam = nflTeams.find(t => t.id === value);
  const displayName = currentTeam ? `${currentTeam.location} ${currentTeam.name}` : '';

  useEffect(() => {
    if (showDropdown) {
      if (inputValue) {
        const filtered = availableTeams.filter(team =>
          `${team.location.toLowerCase()} ${team.name.toLowerCase()}`.includes(inputValue.toLowerCase())
        );
        setFilteredTeams(filtered);
        setSelectedIndex(0);
      } else {
        setFilteredTeams(availableTeams);
        setSelectedIndex(0);
      }
    }
  }, [inputValue, showDropdown]);

  const [filteredTeams, setFilteredTeams] = useState([]);

  // Group teams by conference and division
  const groupedTeams = (teams) => {
    const groups = [];
    
    // Add default team first
    const defaultTeam = teams.find(t => !t.conference);
    if (defaultTeam) {
      groups.push({ type: 'default', team: defaultTeam });
    }
    
    // NFC divisions
    ['North', 'East', 'South', 'West'].forEach(division => {
      const divisionTeams = teams.filter(t => t.conference === 'NFC' && t.division === division);
      if (divisionTeams.length > 0) {
        groups.push({ type: 'header', label: `NFC ${division}` });
        divisionTeams.forEach(team => groups.push({ type: 'team', team }));
      }
    });
    
    // AFC divisions
    ['North', 'East', 'South', 'West'].forEach(division => {
      const divisionTeams = teams.filter(t => t.conference === 'AFC' && t.division === division);
      if (divisionTeams.length > 0) {
        groups.push({ type: 'header', label: `AFC ${division}` });
        divisionTeams.forEach(team => groups.push({ type: 'team', team }));
      }
    });
    
    return groups;
  };

  const handleSelectTeam = (teamId) => {
    onChange(teamId);
    setInputValue('');
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    const selectableItems = groupedTeams(filteredTeams).filter(item => 
      item.type === 'team' || item.type === 'default'
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, selectableItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectableItems[selectedIndex]) {
        handleSelectTeam(selectableItems[selectedIndex].team.id);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setInputValue('');
    }
  };

  const handleFocus = () => {
    setInputValue('');
    setFilteredTeams(availableTeams);
    setShowDropdown(true);
    setSelectedIndex(0);
  };

  const handleBlur = () => {
    // Delay to allow click events on dropdown items
    setTimeout(() => {
      setShowDropdown(false);
      setInputValue('');
    }, 200);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  return (
    <div className="team-selector">
      <input
        ref={inputRef}
        type="text"
        value={showDropdown ? inputValue : displayName}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Select team..."
        className="team-input"
        readOnly={!showDropdown}
      />
      {showDropdown && (
        <div className="team-dropdown">
          {groupedTeams(filteredTeams).map((item, index) => {
            if (item.type === 'header') {
              return (
                <div key={`header-${item.label}`} className="team-division-header">
                  {item.label}
                </div>
              );
            } else {
              const selectableIndex = groupedTeams(filteredTeams)
                .slice(0, index)
                .filter(i => i.type === 'team' || i.type === 'default')
                .length;
              
              return (
                <div
                  key={item.team.id}
                  className={`team-option ${selectableIndex === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectTeam(item.team.id)}
                  onMouseEnter={() => setSelectedIndex(selectableIndex)}
                >
                  {item.team.location} {item.team.name}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

export default TeamSelector;
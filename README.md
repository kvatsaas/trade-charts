# NFL Draft Trade Charts Calculator

## Existing Features

- Correct trade chart values (with some extrapolation) for five different charts
- Shows value difference as both points and percentage
- Shows value for each pick individually
- Calculates the pick number closest to making the trade even
- Includes future picks (devalued)

## Planned/ideated features

- Improve design/UI
- Clean up/refactor code as needed
- Mark picks owned by the selected team
 - Might eventually want to do this for each year, so keep that in mind 
- Add a button to update team inventory with the current trade (only with real teams selected)
  - This should clear the selected picks and display the list of trades made
  - User can label the trade (optional)
  - Allow this for trades with no picks on one side and infer that a player is involved
    - Potentially allow user to label player(s). Labeling the trade might be enough
  - Will also need a reset and undo/redo
    - Redo and reset should clear the currently entered trade
    - Undo should enter the undone trade in the selectors
- Add suggestions for imbalanced trades (and maybe remove requirement for both teams to have a pick entered)
  - Button to apply suggestion
- 'About' dialog
- Disable trading future comp picks (probably just assume current cutoffs)
- Add trade comparison
- Add ability to input multiple trades and see cumulative value (change team inventory when doing this)
  - Maybe combine this with the trade list feature - select a team to show cumulative value for all their trades in the list? Or one button to show for everyone? Or both?
- Import/export options:
  - Export valuation of single trade, list of trades for multiple teams, cumulative trades for one team for easy sharing
- Improve valuation method for future picks
- Add various settings:
  - change to different year (need to add cutoffs for past classes)
  - choose future pick value method
    - top pick of the subsequent round (add one round per year)
  - change number of future years available
  - some of these will require a reset
- Add historical trade data/grades (both individual and draft year?)
- Calculate inferred value for a team and/or time range from historical data
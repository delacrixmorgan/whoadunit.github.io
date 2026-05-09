# Base Prompts

## Create representative_XXXX.xlsx

YEAR = 20XX

Create a XLSX file called representative_YEAR.xlsx based on representative_base.xlsx use data from results_YEAR.mw.

1) If there's no name for the seat, then don't include that row.
2) If there's no gender, then make an educated guess. Male or Female.


## Wiki Extraction

I want you to read, then export as XLSX.

# -> stateSeatCode
Constituency -> stateSeatName
Winner -> name

Value within the () in Winner -> party
i.e
If It's PH-DAP, then output DAP in party.
If there's only DAP without any -, then output DAP in party.
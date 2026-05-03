# TODO

## Create representative_base.xlsx

https://en.wikipedia.org/w/index.php?title=List_of_Malaysian_electoral_districts&useskin=vector

Create a MD file called MalaysianElectoralDistrict.md from `electoral_district.mw`.

1) Extracts these attributes and format them ascending order based on `federalSeatCode` in table form.
federalSeatCode
federalSeatName	
stateSeatCode	
stateSeatName
pollingDistricts

2) Then, have subheaders with the name of the state.
Perlis
xxx
Kedah
xxx
...

3) Based on MalaysianElectoralDistrict.md, then generate a xlsx file called representative_base.xlsx. For the pollingDistricts make it a List<String>.
state
federalSeatCode	
federalSeatName
stateSeatCode
stateSeatName
pollingDistricts: List<String>
type
name
party
gender
email: List<String>
phoneNumber: List<String>
facebook: List<String>
twitter/𝕏: List<String>

## Create representative_2023.xlsx

https://en.wikipedia.org/wiki/Results_of_the_2023_Malaysian_state_elections_by_constituency?useskin=vector

Create a XLSX file called representative_2023.xlsx based on representative_base.xlsx use data from results_2023.mw.

1) If there's no name for the seat, then don't include that row.
2) If there's no gender, then make an educated guess. Male or Female.

## Create representative_2022.xlsx

https://en.wikipedia.org/wiki/Results_of_the_2022_Malaysian_general_election_by_parliamentary_constituency?useskin=vector#Perlis

Create a XLSX file called representative_2022.xlsx based on representative_base.xlsx use data from results_2022.mw.

1) If there's no name for the seat, then don't include that row.
2) If there's no gender, then make an educated guess. Male or Female.

## Update DATA.md

Update DATA.md with this new data structure.

state
federalSeatCode	
federalSeatName
stateSeatCode
stateSeatName
pollingDistricts: List<String>
type
name
party
gender
email: List<String>
phoneNumber: List<String>
facebook: List<String>
twitter/𝕏: List<String>

## Update Website Data Structure Implementation

Update the website based on this new data structure DATA.md.
# CampusFind test cases

Run these tests against your deployed contract. Record actual result, transaction hash and screenshot for submission.

| ID | Scenario | Input / action | Expected result |
|---|---|---|---|
| T01 | Valid lost report | Non-empty title, description and location; `isFoundItem=false` | Transaction succeeds; report appears in UI |
| T02 | Valid found report | Non-empty fields; `isFoundItem=true` | Transaction succeeds; report is labelled FOUND ITEM |
| T03 | Empty title | Call `createReport("", "Description", "Library", false)` | Reverts with `Title is required` |
| T04 | Empty description | Call `createReport("Bottle", "", "Library", false)` | Reverts with `Description is required` |
| T05 | Empty location | Call `createReport("Bottle", "Black bottle", "", false)` | Reverts with `Location is required` |
| T06 | Title too long | Title longer than 80 bytes/characters for basic ASCII test | Reverts with `Title too long` |
| T07 | Description too long | Description longer than 500 bytes/characters for basic ASCII test | Reverts with `Description too long` |
| T08 | Location too long | Location longer than 100 bytes/characters for basic ASCII test | Reverts with `Location too long` |
| T09 | Unauthorized resolution | Account B calls `resolveReport(id)` for a report created by Account A | Reverts with `Only reporter can resolve` |
| T10 | Resolve own report | Account A calls `resolveReport(id)` for its open report | Transaction succeeds; status becomes Resolved |
| T11 | Resolve twice | Call `resolveReport(id)` after it is resolved | Reverts with `Already resolved` |
| T12 | Nonexistent report | Call `getReport(999999)` for an unused ID | Reverts with `Report does not exist` |
| T13 | Read registry | Call `getAllReports()` and `getReportCount()` | Returns stored reports and count |

## Results log (fill in after execution)

| Test ID | Actual result | Transaction hash / revert message | Screenshot filename |
|---|---|---|---|
| T01 | Pending |  |  |
| T03 | Pending |  |  |
| T09 | Pending |  |  |
| T10 | Pending |  |  |
| T11 | Pending |  |  |
| T13 | Pending |  |  |

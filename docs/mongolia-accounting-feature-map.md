# Mongolia Accounting Feature Map

This document maps the workbook `/Users/macbookair/Downloads/BBDZ  2024 (1).xlsx` to the current app and shows what needs to exist for a Mongolian accountant to produce a full financial statement package inside the web app.

## 1. Real-world workflow

Most Mongolian accounting workbooks follow this order:

1. Record transactions (`Гүйлгээ`)
2. Roll them into a trial balance (`Гүйлгээ баланс`)
3. Generate core statements:
   - Balance sheet (`СБТ`)
   - Income statement (`ОДТ`)
   - Statement of changes in equity (`ӨӨТ`)
   - Cash flow statement (`МГТ`)
4. Prepare support schedules:
   - VAT / NӨAT
   - NDSH / payroll social insurance
   - fixed asset register
   - tax and disclosure workpapers

That same flow should drive the app UX.

## 2. Workbook to app mapping

| Workbook sheet | Accounting meaning | App data model | Current status |
| --- | --- | --- | --- |
| `Гүйлгээ` | transaction input / journal working sheet | `JournalEntry`, `JournalLine`, `Account`, `Company` | Supported |
| `Sheet1` | chart of accounts / account codes | `Account` | Supported |
| `Гүйлгээ баланс` | trial balance | report query over accounts + journal lines | Supported |
| `СБТ` | balance sheet | balance sheet report | Supported |
| `ОДТ` | income statement | income statement report | Supported |
| `ӨӨТ` | statement of changes in equity | equity movement report | Missing |
| `МГТ` | cash flow statement | cash flow report | Missing |
| `Sheet4` | VAT / NӨAT schedule | tax ledger / VAT module | Missing |
| `ndsh`, `Sheet5`, `Sheet6` | payroll and social insurance schedules | payroll / NDSH module | Missing |
| `Sheet2` | fixed asset detail register | fixed asset + depreciation module | Missing |
| `1` | printable statutory statement cover/layout | export/print package | Partial |

## 3. Current app coverage

### Backend already supports

- Authentication and company setup
- Chart of accounts
- Journal entry creation and voiding
- Trial balance
- Balance sheet
- Income statement
- Account ledger

Relevant routes:

- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `GET /api/companies`
- `POST /api/companies`
- `GET /api/companies/:companyId/accounts`
- `POST /api/companies/:companyId/accounts`
- `GET /api/companies/:companyId/journal-entries`
- `POST /api/companies/:companyId/journal-entries`
- `PATCH /api/companies/:companyId/journal-entries/:entryId/void`
- `GET /api/companies/:companyId/reports/trial-balance`
- `GET /api/companies/:companyId/reports/balance-sheet`
- `GET /api/companies/:companyId/reports/income-statement`
- `GET /api/companies/:companyId/reports/accounts/:accountId/ledger`

### Frontend already supports

- Mongolian-first sign-in and sign-up
- company creation
- account creation/listing
- journal entry posting
- trial balance / balance sheet / income statement viewing

## 4. Recommended app flow

The app should mirror the accountant workflow instead of exposing reports too early.

### Phase 1: setup

Screens:

- Sign in / sign up
- Create company
- Select fiscal year and base currency
- Load default Mongolian chart of accounts

Tables / models:

- `User`
- `Company`
- `Account`
- `AccountingPeriod`

Needed improvement:

- add a seeded/default chart of accounts for Mongolia so users do not create every account manually

### Phase 2: bookkeeping

Screens:

- Journal entries
- Account ledger
- Period list
- Month-end checklist

Tables / models:

- `JournalEntry`
- `JournalLine`
- `Attachment`
- `AccountingPeriod`

Needed improvement:

- close / reopen accounting periods
- prevent posting into closed periods
- import from Excel or CSV transaction sheets

### Phase 3: reporting

Screens:

- Trial balance
- Balance sheet
- Income statement
- export / print

Tables / models:

- current reporting can derive from `JournalLine` + `Account`

Needed improvement:

- comparative prior-period columns
- print layout matching accountant expectations
- save report snapshots by period if required

### Phase 4: statutory package

Screens:

- Statement of changes in equity
- Cash flow statement
- Notes / disclosures
- Year-end close dashboard

Needed models:

- likely a `ReportSnapshot` or `FinancialStatement` table
- likely disclosure/note tables or templated note blocks

Needed backend:

- `GET /reports/cash-flow`
- `GET /reports/changes-in-equity`
- notes/disclosure endpoints

### Phase 5: compliance modules

Screens:

- VAT ledger and monthly VAT summary
- Payroll / NDSH register
- Fixed asset register and depreciation

Likely new models:

- `VatTransaction` or tax tagging on journal lines
- `Employee`
- `PayrollRun`
- `SocialInsuranceRecord`
- `FixedAsset`
- `DepreciationEntry`

## 5. Sheet-by-sheet implementation target

### `Гүйлгээ`

Target app behavior:

- create one `JournalEntry` per business event
- create at least two `JournalLine` rows per entry
- support reference, memo, attachment, creator, and posted/void status

UI:

- existing `journal-entries` page is the starting point

Next improvement:

- add Excel/CSV import that maps rows to journal entries

### `Гүйлгээ баланс`

Target app behavior:

- aggregate opening balance + period debits/credits + closing balance by account

UI:

- existing reports page can show this

Next improvement:

- allow month / quarter / year filter
- show grouped totals by account type

### `СБТ`

Target app behavior:

- classify accounts into current assets, non-current assets, liabilities, equity

Dependency:

- accurate account types in chart of accounts

Next improvement:

- add prior-period comparison and printable official layout

### `ОДТ`

Target app behavior:

- classify revenue, cost of goods sold, and expenses

Dependency:

- correct account type tagging

Next improvement:

- subtotal lines for gross profit, operating profit, net profit

### `ӨӨТ`

Target app behavior:

- reconcile opening equity
- owner contributions
- distributions / withdrawals
- revaluation or reserve movements
- current period profit/loss
- closing equity

Implementation note:

- this can be derived partly from journal entries if equity movements are tagged correctly
- some lines may need manual adjustment inputs or a report mapping table

### `МГТ`

Target app behavior:

- show operating, investing, and financing cash flows

Implementation note:

- indirect method is usually easiest if balance sheet and income statement are already reliable
- needs account mapping rules for cash flow categories

### `Sheet4` VAT

Target app behavior:

- track output VAT and input VAT
- summarize by month
- tie tax balances back to ledger

Implementation note:

- easiest first version is account-based VAT reporting
- stronger version adds per-transaction VAT metadata

### `ndsh`, `Sheet5`, `Sheet6`

Target app behavior:

- payroll gross pay
- employer and employee contributions
- monthly insurance totals
- filing-ready summaries

Implementation note:

- this is a real module, not just a report
- if payroll is out of scope, support journal import from an external payroll system

### `Sheet2` fixed assets

Target app behavior:

- fixed asset register
- acquisition date, useful life, salvage value, depreciation method
- monthly depreciation posting

Implementation note:

- fixed asset schedules are difficult to maintain manually in journals alone
- this should become a dedicated module

## 6. Best next build order

If the goal is "make the app usable by a Mongolian accountant as soon as possible", build in this order:

1. Default Mongolian chart of accounts
2. Accounting periods and period close
3. Journal import from workbook / CSV
4. Printable trial balance, balance sheet, income statement
5. Cash flow statement
6. Statement of changes in equity
7. VAT module
8. Fixed asset register
9. Payroll / NDSH support
10. Notes / disclosures and full year-end package

## 7. Minimum path to replace the workbook

The workbook can be replaced in stages.

### Stage A

Replace:

- `Гүйлгээ`
- `Гүйлгээ баланс`
- `СБТ`
- `ОДТ`

This is the shortest path to a useful accounting system.

### Stage B

Replace:

- `ӨӨТ`
- `МГТ`

This makes the app capable of producing the full core financial statements.

### Stage C

Replace:

- VAT sheets
- NDSH sheets
- fixed asset sheets

This makes the app more realistic for ongoing Mongolian business use.

## 8. Concrete next coding tasks

The next code changes should be:

1. Seed a default Mongolian chart of accounts and add a "load defaults" button on company setup
2. Add `AccountingPeriod` CRUD plus close/open actions
3. Add journal import from Excel/CSV
4. Add report export/print layouts
5. Add cash flow and equity statement report endpoints and pages

If those five are done, the app moves from "general accounting demo" to "real accountant workflow".

# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

**Epic**

As a Facility I/We need to have the ability to assign or modify custom ID's for the agents we work with.

**Ticket 1:**

Title: DB setup and housekeeping (assuming RBMS like postgres)

Desc: 
- Create a join table between `facility` and `agent` called `facilityAgent` with `facilityId`, `agentId`, `id`, `customId` and creation and updation timestamps.
- `id`, `customId` have unique constrains.
- Run DB migrations and Seed data into the join table. (customId will be null till assigned).

Acceptance Criteria:
- All facilities and agents need to be linked via join table with seeded data
- Should cascade on deletion

Story Point: 0.5D

**Ticket 2:**

Title: Ablility to create or edit custom id for a specific agent wrt to a facility

Desc: 
- Create a new API(s) (not going into versioning or naming sequences :P) whose ablitiy is to create/edit custom id.
- Input params include `customId` and `agentId` where in all of them are strings.
- API needs to get `facilityId` from `token` or `cashe` or other means.
- API should smartly create or edit based upon Params. (Can still live with two seperate API's as well).
- API needs to throw errors if request do not contain required fields or they are not strings.
- `customId` must be unique throw error if not unique. `facilityId` and `agentId` must be valid else thow errors.
- API should either return `SUCCESS` or the created/updated record.

Acceptance Criteria:
- The Created API needs to create and update `customId` in the `facilityAgent` table.
- Should throw error on invalid requests.

Story Point: 1D

**Ticket 3:**

Title: Frontend UI form to assign a custom ID.

Desc: 
- Build a form for facilities which will enable them to assign customId.
- Form should have a searchable dropdown by which a facilities admin can search agent and select them.
- A text input titled Custom Id. With a submit button.
- Show success and error(s) message(s) upon making the API(s) request.

Acceptance Criteria:
- The facilities admin needs to view and submit the form to assign customId.
- Should throw error on invalid requests.

Story Point: 0.5D

**Ticket 4:**

Title: Refactor `getShiftsByFacility` and `generateReport` to use customId.

Desc: 
- Refactor `getShiftsByFacility` and `generateReport` DB queries adding relation `facilityAgent` join table.
- Return `customId` if available or `null` if not.
- `generateReport` to use `customId` when available.

Acceptance Criteria:
- Both the functions need to show have a key for `customId` with available id or `null`.

Story Point: 0.5D

**Ticket 5:**

Title: Testing customId integration.

Desc: 
- Manual Dev test by dev.
- Write unit test cases for the EPIC with their acceptance criteria and make sure test coverage does not drop.
- Write a e2e scenario for the EPIC with their acceptance criteria.

Acceptance Criteria:
- All the test cases need to perform as required by above acceptance criteria.
- All test cases need to pass.

Story Point: 1.5D
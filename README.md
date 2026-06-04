# README.md — Scrum Project Report Template

**University of Cincinnati**

**EECE/CS-3093C — Software Engineering, Summer 2026**

**Instructor:** Dr. Phu Phung

---

# Scrum Project — TODO: Your Project Name

> Replace **"Messenger App Project"** with the title of your team's secure web application.

## Team Members

_Teams are 3–4 students (per syllabus). Solo teams are not permitted._

1. Member 1 Corey Brunner — brunnecj@mail.uc.edu — Scrum Master
2. Member 2 Pawan Poudyel — poudyepn@mail.uc.edu — Product Owner
3. Member 3 Zackary Bailey — baileyzc@mail.uc.edu — Developer
4. Member 4 Abdulah Dia — diaah@mail.uc.edu — Developer
5. Member 5 Garrett Becker — beckergt@mail.uc.edu — Developer

---

# Project Management Information

| Item | URL |
|---|---|
| Team homepage / landing page | [https://github.com/uc-se-sm26-team1/uc-se-sm26-team1.github.io](https://github.com/uc-se-sm26-team1/uc-se-sm26-team1.github.io) |
| Live prototype (Azure App Services) | https://TODO.azurewebsites.net |
| GitHub Projects board (private) | https://github.com/orgs/uc-se-sm26-team1/projects/2/views/1 |
| Source code repository (private) | https://github.com/uc-se-sm26-team1/scrum-project |
| MongoDB Atlas cluster (configuration only — no credentials) | _e.g., cluster name, region_ |

## Revision History

| Date       | Version | Description                          | Author |
|------------|---------|--------------------------------------|--------|
| 05/28/2028 | 0.1     | Initial draft (Sprint 0) and README.md implementation             | TODO   |
| MM/DD/YYYY | 0.2     | Added use cases and architecture     | TODO   |

---

# Overview

_Start in Sprint 0; refine across all sprints._

Describe the project in 2–4 paragraphs: the problem it addresses, the target users, and a high-level summary of the proposed solution. Include a **high-level architecture diagram** 

---

# System Analysis

_Start in Sprint 0; keep updating._

## User Requirements

List the high-level functional and non-functional requirements. These will be refined into user stories and use cases. _(Main focus of Sprint 0.)_

- **FR-1:** TODO — _As a [role], I want to [capability] so that [benefit]._
- **FR-2:** As a registered user, I want to create a new group chat by selecting multiple users and assigning a group name, so that I can coordinate and communicate with my team in a shared messaging space without needing separate individual messages.
- **NFR-1 (Performance):** TODO
- **NFR-2 (Usability):** TODO
- **NFR-3 (Security — see §Security):** TODO

## User Stories & Product Backlog

https://github.com/orgs/uc-se-sm26-team1/projects/2

Include a representative screenshot of the **Todo / In Progress / Done** columns at the end of each sprint. _(Sprint 0 onward.)_

## Use Cases

Include the **use-case diagram** and a **brief description** (1–3 sentences) for each use case. _(Main focus of Sprint 0.)_

| UC ID | Use Case            | Primary Actor | Brief Description |
|-------|---------------------|---------------|-------------------|
| UC-01 | Alert Team              | Connected User          | Connected User uses the '@(tagline/username)' to alert team members; Connected User clicks 'Send' and all team members are alerted. |
| UC-02 | Receive Read Receipts                | Connected User          | The receiving user reads group message. The user that sent the message sees through the chat UI that the receiving user has read the message. |
| UC-03 | Set user status| Connected User | System allows the user to select a custom user status to display availability |
| UC-04 | Create Group Message | Connected User | Actor selects “Create Group Chat,” enters group details (such as group name and participants), and submits the request; the system validates the input, creates a new group conversation. |
| UC-05   |   Authentication |  Connected User |   The user would like to log into the messaging app. The user is prompted to enter his details. The system verifies the user's credential and decides to let the user proceed or not.|
| UC-06 | Links to external websites| Connected User| Actor pastes link in chat and it is able to be clicked on and opens in web browser|

---

# System Design

_Start in Sprint 1; keep updating._

## Architecture

Describe the architectural style (e.g., layered, client-server, microservices) and the major components. Embed an architecture diagram if it differs from the high-level one in §Overview.

## Use-Case Realization

For each use case in §Use Cases, describe how it is realized in code: which modules, endpoints, and database collections participate. **Sequence diagrams** are encouraged for non-trivial flows (e.g., authentication, message send/receive). _(Sprint 1 onward.)_

## User Interface

Embed UI mockups or screenshots and describe the interaction model. Wireframes are acceptable for Sprint 1; final screenshots for Sprint 3. _(Sprint 1 onward.)_

## Database

Describe your **MongoDB Atlas** schema: collections, fields, indexes, and relationships. Include a sample document for each collection. _(Sprint 2 onward; refine in Sprint 3.)_

```json
// Example collection: users
{
  "_id": "ObjectId",
  "username": "string (unique, indexed)",
  "passwordHash": "string (bcrypt)",
  "createdAt": "ISODate"
}
```

---

# Security (SSDLC)

_Start in Sprint 0; **mandatory** updates at the Sprint 1–2 SSDLC checkpoint and again in Sprint 3._

This section documents how your team applies the **Secure Software Development Lifecycle** across every phase. Do **not** treat security as an afterthought — it is graded across all sprints.

## Security Requirements

List security requirements alongside functional requirements. _(Sprint 0.)_
- **SR-1:** TODO — _e.g., All authentication tokens must be transmitted over HTTPS only._
- **SR-2:** TODO — _e.g., Passwords must be hashed with bcrypt (cost ≥ 12); plaintext passwords must never be logged or stored._

## Threat Model

Identify assets, trust boundaries, and threats. STRIDE or attack-tree format is acceptable. _(Sprint 0–1.)_

| Asset | Threat | Mitigation |
|-------|--------|------------|
| User credentials | Credential stuffing | Rate limiting + bcrypt |
| TODO  | TODO   | TODO       |

## Security Review Notes

Summarize findings from your Sprint 2 security review and any remediation taken. _(Sprint 2 onward.)_

---

# Implementation

_Start in Sprint 1; keep updating._

Specify your development approach, languages, frameworks, and runtime. Default stack for this course:

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Runtime          | Node.js (Azure Cloud Shell for development)     |
| Server framework | TODO _(e.g., Express)_                          |
| Database         | MongoDB Atlas                                   |
| Client           | HTML / CSS / JavaScript _(framework optional)_  |
| Version control  | git + GitHub (branches + pull requests + code review) |
| Project mgmt     | GitHub Projects                                 |
| Hosting          | Azure App Services                              |
| CI/CD            | GitHub Actions                                  |
| ...              | ...          |

For each sprint, add a subsection that summarizes new implementation work. Include code snippets only when they illustrate a non-trivial design decision (not as a substitute for the source code itself).

## Getting Started Locally

```bash
# Clone
git clone git@github.com:TODO/TODO.git
cd TODO

# Install dependencies
npm install

# Configure environment (copy and edit; never commit .env)
cp .env.example .env

# Run
npm start
```

## CI/CD Pipeline

Describe the GitHub Actions workflow(s) under `.github/workflows/`. _(Sprint 1 onward.)_

- **Build & test:** triggered on every push and pull request.
- **Deploy:** triggered on merge to `main`; deploys to Azure App Services.

## Deployment

Describe how to deploy and the URL of the live application. Include a note on environment variables (set in Azure App Services Configuration, never in source). _(Sprint 1 onward.)_

---

# Testing & Quality Assurance

_Start in Sprint 1; **major** focus in Sprint 3._

## Test Plan

Summarize your testing strategy across unit, integration, and system testing. _(Sprint 2 onward.)_

## Test Coverage

Report current test coverage and how to run the suite locally and in CI.

```bash
npm test
```

## QA Plan

Manual test cases for user-facing flows, with expected vs. actual results. _(Sprint 3.)_

---

# GenAI Usage & Reflection

_Start in Sprint 2; **required** in Sprint 3._

Per the course academic integrity policy, the team must document all AI-assisted work on the team project. **Sprint 3 recommends the team to use a GenAI tool** for the final prototype and to document each substantive prompt.

---

# Software Process Management

_Start in Sprint 0; keep updating._

Describe how your team applies **Scrum**: roles, ceremonies (sprint planning, daily stand-ups, review, retrospective), and tools (GitHub Projects board, GitHub Issues, pull requests).

Include:
- A screenshot of the **GitHub Projects board** (Todo / In Progress / Done) at the end of each sprint.
- A **Roadmap view** screenshot from GitHub Projects, or a timeline produced from issue milestones. _(Note: GitHub Projects has a Roadmap view rather than a true Gantt chart; a Roadmap screenshot satisfies this requirement.)_

## Scrum Process

> Copy the block below for each sprint (Sprint 0, 1, 2, 3).

### Sprint X

**Duration:** YYYY-MM-DD to YYYY-MM-DD

#### Sprint Goal
TODO — one sentence.

#### Completed PBIs / Tasks
1. TODO
2. TODO
3. TODO

#### Contributions

| Member | Hours | Contribution Summary |
|--------|-------|----------------------|
| Member 1 | X | TODO |
| Member 2 | X | TODO |
| Member 3 | X | TODO |
| Member 4 | X | TODO |
| Member 5 | X | TODO |

#### Sprint Retrospective

| Good | Could have been better | How to improve |
|------|------------------------|----------------|
|      |                        |                |
|      |                        |                |


Working through the sprints is a continuous-improvement process. The retrospective happens at the end of a sprint, before planning the next one. Cover three things briefly:

- **What went well** — celebrate and reinforce.
- **What could have been better** — be specific (e.g., "we underestimated authentication" not "things were hard").
- **How we will improve next sprint** — concrete, owned actions.

Keep it under an hour. The output is bullet points in the table above and any new PBIs created on the board.

---

# User Guide / Demo

_Start in Sprint 1; finalize in Sprint 3._

Write this section as both a **demo** (with screenshots of the running application) and a **how-to** for a first-time user. Cover sign-up, login, and the main user flows.

---

# License & Code of Conduct

This project is developed for academic purposes as part of EECE/CS-3093C at the University of Cincinnati. The team follows the **ACM/IEEE Software Engineering Code of Ethics** (https://www.acm.org/code-of-ethics).

If your team chooses to publish the repository after the course, add an explicit license (e.g., MIT) here and a `LICENSE` file at the repo root.

---

_End of template. Last template revision: TODO: YYYY-MM-DD._

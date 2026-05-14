<div align="center">
  <img src=".github/banner.svg" alt="Brittle" width="100%"/>
</div>

<br/>

<div align="center">

**Self-hosted Playwright grid with flake analytics built in.**<br/>
Per-env rollups · strong-flake detection · video + trace on every session.

<br/>

[![Try the Demo](https://img.shields.io/badge/Try%20the%20Demo-app.brittle.dev-E8893B?style=for-the-badge&logoColor=white)](https://app.brittle.dev)
&nbsp;
[![License](https://img.shields.io/badge/License-Apache%202.0-4a90d9?style=for-the-badge)](LICENSE)
&nbsp;
[![npm](https://img.shields.io/badge/npm-%40brittlehq-cc3534?style=for-the-badge)](https://www.npmjs.com/org/brittlehq)

</div>

---

<div align="center">

### Try the live demo

**[app.brittle.dev](https://app.brittle.dev)**

```
Email:    demouser@brittle.dev
Password: demouser
```

</div>

---

## What it does

Brittle is a drop-in backend for Playwright. Add the reporter, run your tests exactly as you do today, and get a dashboard that tells you *which browser*, *which branch*, and *which commit* broke — without sifting through CI logs.

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Per-env rollups
Results are keyed on `(testId, branch, env, target)` — not just the test name. A WebKit-only failure gets its own row. Chromium staying green doesn't mask it.

</td>
<td width="50%" valign="top">

### Strong-flake detection
If the same commit produced both a pass and a fail, it's definitively flaky. No thresholds, no heuristics — just the signal from the data you already have.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Run triage dashboard
Open a run and see failures tagged **NEW**, **KNOWN**, or **REGRESSED** relative to the last green run on that branch. The ones that matter surface first.

</td>
<td width="50%" valign="top">

### Session replay
Every session comes back with video, HAR, and Playwright trace. Scrub the recording, jump to the failing step, open the trace — without leaving the dashboard.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Test history heatmap
30-day pass/fail heatmap per test, per env. Spot recurring flakes and silent regressions at a glance without writing a single query.

</td>
<td width="50%" valign="top">

### Multi-tenant from day one
Org → Project hierarchy with RBAC (Admin / Member / Viewer) and API tokens scoped per project. A leaked token's blast radius is one project.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Drop-in reporter
Four lines in `playwright.config.ts`. No agent, no daemon. Runs alongside your existing reporters and forwards results, traces, and screenshots automatically.

</td>
<td width="50%" valign="top">

### Your infra, your data
One Postgres, one container. Runs in your VPC, your k8s cluster, or on Railway in minutes. Nothing leaves your network unless you want it to.

</td>
</tr>
</table>

---

<div align="center">

**[brittle.dev](https://brittle.dev)** · **[Docs](https://brittle.dev/docs)** · **[npm](https://www.npmjs.com/org/brittlehq)** · **[Apache 2.0](LICENSE)**

</div>

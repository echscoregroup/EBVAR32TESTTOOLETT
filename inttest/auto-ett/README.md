# EBVA Intelligent — GitHub automated ETT

Repository: `echscoregroup/EBVAR32TESTTOOLETT`  
Branch: `INTV134AUTOTEST`

## Protected-source handling
- Production source was read from `echscoregroup/EBVA-RELEASE/main`, whose observed `index.html` blob SHA was `57e6a2c2ee50f235434524fe2f9ec8f24ef309d0`.
- The integration is a new file only: `inttest/candidate/EBVA_R34_INT_V134_INTEGRATED_TEST.html`.
- Production `EBVA-RELEASE/main`, `EBVA-TEST`, and approved Q&A sources were not written to or changed.
- The original V1.34 resolver source is retained separately under `inttest/candidate/`.

## Automated workflow
GitHub Actions workflow: `.github/workflows/ett-intelligent.yml`

The workflow runs Playwright Chromium against the R3.4-derived integration-test copy and produces `artifacts/auto-ett-results.csv`.

Two suites are included:
1. **BASELINE_412** — enumerates the 323 records in the protected R3.4 `CONTROLLED_QA` table plus the 89 entries in `R330_QA`, then compares each question's displayed answer with the source answer. Expected total: 412.
2. **HR_CONFIRMED** — evaluates the six user-confirmed cases HR12, HR15, HR38, HR43, HR60 and HR70, checking response type, source ID when applicable, and expected answer text.

The workflow exits non-zero when any comparison fails and uploads the CSV artifact even on failure. A FAIL is a real test failure, not silently converted to PASS. HR12's user-provided oracle (age 72 question with a 75+ answer) is preserved as supplied; any mismatch is reported, not silently corrected.

## Interpretation and limits
- This is an isolated integration candidate, not a release and not a replacement for the approved baseline.
- The 412 check compares integrated output to the R3.4 source records exposed in the same read-only-derived copy. It is a preservation regression, not an independent audit of the source corpus.
- The six HR cases are a focused acceptance subset. The remaining HR01–HR70 oracle and broader independent paraphrase suite must be added before claiming full Intelligent EBVA acceptance.
- The earlier manual V1.34 harness remains available for historical review; it is not the automated workflow.
- Do not merge or publish this candidate without explicit user approval.

# EBVA Intelligent — GitHub automated ETT

Repository: `echscoregroup/EBVAR32TESTTOOLETT`  
Branch: `INTV134AUTOTEST`

## Protected-source handling
- Production source was read from `echscoregroup/EBVA-RELEASE/main`, whose observed `index.html` blob SHA was `57e6a2c2ee50f235434524fe2f9ec8f24ef309d0`.
- The integration is a new file only: `inttest/candidate/EBVA_R34_INT_V134_INTEGRATED_TEST.html`.
- Production `EBVA-RELEASE/main`, `EBVA-TEST`, and the approved source records were not written to or changed.
- The original V1.34 resolver source is retained separately under `inttest/candidate/`.

## Automated workflow
GitHub Actions workflow: `.github/workflows/ett-intelligent.yml`

The workflow runs Playwright Chromium against the R3.4-derived integration-test copy and produces `artifacts/auto-ett-results.csv`.

Two suites run:
1. **BASELINE_412** — exact answer-preservation comparison for 412 source question cases exposed by the read-only-derived R3.4 copy: 83 `CONTROLLED_QA`, 90 `ECHS_CARD_QA`, 150 `CONTROLLED_NL` paraphrase entries mapped to their base questions, and 89 `R330_QA` reimbursement/dental entries. The 150 NL entries are tested metamorphically: the answer returned for each NL wording is compared with the answer returned for its declared `base_q` by the same resolver. This checks paraphrase consistency; it is not an independent correctness oracle for the base answer.
2. **HR_CONFIRMED** — evaluates all HR01–HR70 cases. Locked oracles are scored against response type, source ID when applicable, and expected answer text. Cases marked `NEEDS_REVIEW` remain `UNRESOLVED` rather than being counted as passes.

The workflow exits non-zero when any comparison fails and uploads the CSV artifact even on failure. A FAIL is a real test failure, not silently converted to PASS. HR12's user-provided oracle (age 72 question with a 75+ answer) is preserved as supplied; any mismatch is reported, not silently corrected.

## Interpretation and limits
- This is an isolated integration candidate, not a release and not a replacement for the approved baseline.
- The 412 suite checks that the integration copy preserves answers exposed by the source R3.4 tables. It is a regression against the protected source copy, not an independent audit of the corpus file.
- The HR suite contains 70 cases, but any oracle marked `NEEDS_REVIEW` must be resolved before claiming full acceptance. The 412 baseline suite verifies preservation/consistency of answers exposed by the candidate; it does not independently validate policy correctness.
- The earlier manual V1.34 harness remains available for historical review; it is not the automated workflow.
- Do not merge or publish this candidate without explicit user approval.

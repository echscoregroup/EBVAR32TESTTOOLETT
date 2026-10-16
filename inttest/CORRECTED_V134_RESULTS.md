# V1.34 HR01–HR70 — Test Method Correction

Date: 16 October 2026  
Repository: `echscoregroup/EBVAR32TESTTOOLETT`  
Branch: `INTV134AUTOTEST`  
Candidate: `EBVAINT016_BUILD169_V134_GENERALIZED_RESOLVER_LOCAL.html`  
Reference harness: `ETTINTV106HR70REPORTFIXED.zip`  
Expected register: `HR01HR70_EXPECTED_ORACLE.csv`

## Correction to the initial report

The earlier `INITIAL_V134_RESULTS.md` reported 43 PASS / 27 FAIL. **Those counts are withdrawn and must not be used as evidence.** The first harness assigned PASS/FAIL using a simplified programmatic comparison. That is not the method used by the supplied ETT V106 HR70 workflow.

## What the supplied ETT V106 actually does

Inspection of `ETTINTV106HR70REPORTFIXED.zip` shows:
- Its README says the operator alone selects PASS or FAIL.
- Its HR70 screen says the expected answer is not used or displayed in HR70 mode.
- Actual resolver output is captured; manual verdict controls the result.
- Its comparison functions are not used to assign the tester's HR70 verdict.
- Its verification note warns that static checks are not a substitute for browser testing and that oracle quality must be reviewed separately.

Therefore, the previous 43/27 automatic score was not comparable to a manual ETT run and is invalidated.

## Corrected method

A new isolated page, `inttest/HR01HR70_MANUAL_REVIEW.html`, has been added on this branch. It runs the selected V1.34 resolver against all 70 questions and captures the actual output, but starts every verdict as PENDING. The tester must select PASS, FAIL, or REVIEW after checking the controlled oracle. It exports a CSV with question, expected result, actual resolver output, manual verdict, and remarks.

This avoids turning a type-only match into PASS and avoids silently changing expected answers. A resolver-only run is not described as a verified browser/UI acceptance run.

## Current evidence status

- Prior automatic 43/27: **WITHDRAWN / INVALID METHOD**
- User-reported manual result: **70/70 PASS**, retained as the user's reported result; this report does not independently certify that result.
- Corrected harness: added to this isolated branch; it has not yet been run by the user in a browser, so no new acceptance score is claimed.
- Oracle review: unresolved for any individual case whose expected answer is ambiguous or not source-supported.
- Approved 412 Q&A: unchanged.
- Production R3.4, EBVA-TEST, and all pre-existing branches/files: unchanged.

## Next validation

Open `HR01HR70_MANUAL_REVIEW.html` locally, select the frozen V1.34 HTML and the HR01–HR70 expected register CSV, run the 70 questions, review each captured output, and save the manual review CSV. Keep REVIEW for oracle ambiguity; do not force a PASS or alter the oracle to improve the score.

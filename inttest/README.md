# EBVA Intelligent V1.34 HR01–HR70 — isolated test branch

Repository: `echscoregroup/EBVAR32TESTTOOLETT`  
Branch: `INTV134AUTOTEST`

## Protection controls
- All work is isolated to this newly created branch.
- Existing branches and pre-existing files are not overwritten or deleted.
- Approved 412-Q&A baseline and expected answers are unchanged.
- Production EBVA R3.4 and EBVA-TEST are unchanged.
- This branch is not a production release.

## Use the corrected harness
Use `inttest/HR01HR70_MANUAL_REVIEW.html`. Do **not** use `inttest/index.html` for acceptance scoring; its initial comparison logic was invalidated and is retained only as history.

1. Download `HR01HR70_MANUAL_REVIEW.html` and open it in a modern desktop browser.
2. Select the frozen V1.34 candidate HTML: `EBVAINT016_BUILD169_V134_GENERALIZED_RESOLVER_LOCAL.html`.
3. Select `HR01HR70_EXPECTED_ORACLE.csv` from the supplied `ETTINTV106HR70REPORTFIXED.zip`.
4. Click **RUN 70 QUESTIONS**.
5. Review each actual resolver output against the controlled oracle. Select PASS, FAIL, or REVIEW; leave unresolved cases as REVIEW.
6. Download the review CSV.

## Why the method changed
The supplied ETT V106 HR70 workflow is manual: the tester selects PASS/FAIL after seeing the actual resolver response. Expected answers are not used by its HR70 verdict mechanism. The previous harness automatically assigned 43 PASS / 27 FAIL using a simplified comparator. That score is withdrawn and invalid; see `inttest/CORRECTED_V134_RESULTS.md`.

The corrected harness runs the resolver and records output but does not assign automatic PASS/FAIL. This avoids type-only false passes and keeps the human acceptance step aligned with ETT V106. It does not claim browser/UI acceptance until the user runs and reviews it in a browser.

## Scope
This is an HR01–HR70 Intelligent resolver review, not a re-test of the approved 412 Q&A baseline. Do not change approved answers to obtain a PASS. Keep source-oracle ambiguities marked REVIEW.
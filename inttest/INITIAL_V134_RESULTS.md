# V1.34 INT resolver automated test — initial execution

Date: 2026-10-16
Repository: echscoregroup/EBVAR32TESTTOOLETT
Branch: INTV134AUTOTEST
Candidate: EBVAINT016_BUILD169_V134_GENERALIZED_RESOLVER_LOCAL.html
Candidate source: local HTML inside EBVAINT016_BUILD169_V134_GENERALIZED_RESOLVER_LOCALPACKAGE.zip
Oracle: HR01HR70_EXPECTED_ORACLE.csv from ETTINTV106HR70REPORTFIXED.zip

## Result
- Test population: 70 (HR01–HR70)
- PASS: 43
- FAIL: 27
- ERROR: 0

This run executed the actual V1.34 resolver function extracted from the candidate HTML in Node.js, with the independent HR01–HR70 expected-result CSV. It is a programmatic resolver run, not yet a browser execution of the GitHub harness page.

Comparison rule used:
- DIRECT: actual resolver outcome must be DIRECT and selected answer text must match the oracle's expected answer after whitespace/case/typographic normalization.
- CLARIFY / MULTI / FALLBACK: outcome type must match the oracle.
- This first-pass comparison does not yet fully verify clarification-option relevance or all approved source IDs; those need strengthening before treating this as final acceptance evidence.

## Failures requiring review
HR01, HR02, HR05, HR07, HR09, HR10, HR14, HR15, HR19, HR21, HR22, HR26, HR27, HR28, HR29, HR32, HR33, HR36, HR40, HR41, HR43, HR44, HR45, HR48, HR54, HR55, HR61.

Do not modify the approved 412 Q&A or expected-result oracle to obtain a pass. Investigate the INT resolver or resolve any genuine oracle conflict through the controlled approval process.

## Integrity boundary
This report and the harness exist only on branch INTV134AUTOTEST. No existing repository branch/file, the original ETT baseline, EBVA-TEST, or production EBVA-RELEASE was modified by this test run.

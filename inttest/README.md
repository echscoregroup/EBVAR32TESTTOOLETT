# EBVA Intelligent V1.34 automated resolver test — isolated branch

Branch: `INTV134AUTOTEST`  
Repository: `echscoregroup/EBVAR32TESTTOOLETT`

## Protection
- This work is isolated to this new branch.
- Existing branches and files are not overwritten or deleted.
- The approved 412-Q&A ETT baseline and its expected answers are not modified.
- Production EBVA R3.4 and EBVA-TEST are not modified.
- This branch contains a new harness at `inttest/index.html`; it is not a production release.

## How to run the INT test
1. Download `inttest/index.html` from this branch and open it in a modern desktop browser.
2. Select the frozen INT V1.34 candidate HTML file: `EBVAINT016_BUILD169_V134_GENERALIZED_RESOLVER_LOCAL.html`.
3. Select the independent oracle CSV `HR01HR70_EXPECTED_ORACLE.csv` from the controlled `ETTINTV106HR70REPORTFIXED.zip` package.
4. Click **START AUTOMATED INT TEST**.
5. Review TOTAL, PASS, FAIL and ERROR, then download the CSV report.

The harness loads the selected INT HTML into an isolated iframe and invokes its exposed `__EBVA_AUDIT__.decide(question)` resolver. It does not call production. It does not edit the selected build or the oracle CSV.

## Important test interpretation
- DIRECT cases compare normalized answer text against the oracle's expected answer.
- CLARIFY, MULTI and FALLBACK cases compare the outcome type. Clarification option content is shown in the report but is not automatically judged by this initial harness.
- A matching outcome type is not proof that the selected clarification options are correct. Review those cases separately.
- This harness is a first automated candidate. Browser validation is required before relying on results. Report errors if the selected build does not expose the expected resolver API.
- This test set is HR01–HR70 from the supplied oracle, not the 412-Q&A regression set. The 412 baseline ETT remains separate and unchanged.

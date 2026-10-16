# V1.34 resolver run — 16 October 2026

## Run identity
- Candidate HTML: `EBVAINT016_BUILD169_V134_GENERALIZED_RESOLVER_LOCAL.html`
- SHA-256: `106c25e3a752fc564672cfa459eb232d7bbef6068f4c2cb425549b7d706d6f07`
- Oracle: `HR01HR70_EXPECTED_ORACLE.csv` from `ETTINTV106HR70REPORTFIXED.zip`
- Questions executed: 70 / 70
- Execution: Chromium headless, actual selected HTML's exposed `__EBVA_AUDIT__.decide(question)` resolver invoked for each question
- Resolver exceptions: 0
- Scope: resolver-output capture only; not the full ETT UI workflow and not a manual acceptance verdict

## Actual outcome types
| Outcome type | Actual count |
|---|---:|
| DIRECT | 43 |
| CLARIFY | 12 |
| MULTI | 1 |
| FALLBACK | 14 |
| ERROR | 0 |

Oracle's expected types are DIRECT 50, CLARIFY 8, FALLBACK 12. There are 16 expected-vs-actual outcome-type differences. This is **not automatically 16 EBVA defects**: each row must be reviewed against its question, approved source IDs, and the correct expected behaviour. No PASS/FAIL score is assigned here.

## Type differences to review
| HR ID | Oracle expected | Actual resolver |
|---|---|---|
| HR01 | CLARIFY | DIRECT |
| HR05 | DIRECT | CLARIFY |
| HR07 | DIRECT | CLARIFY |
| HR09 | DIRECT | CLARIFY |
| HR10 | DIRECT | CLARIFY |
| HR21 | DIRECT | FALLBACK |
| HR22 | FALLBACK | DIRECT |
| HR28 | FALLBACK | DIRECT |
| HR32 | DIRECT | CLARIFY |
| HR33 | DIRECT | CLARIFY |
| HR36 | CLARIFY | FALLBACK |
| HR40 | CLARIFY | FALLBACK |
| HR43 | DIRECT | CLARIFY |
| HR48 | CLARIFY | FALLBACK |
| HR55 | DIRECT | CLARIFY |
| HR61 | DIRECT | MULTI |

## Important interpretation
- This is a fresh, reproducible resolver run; it does not validate the earlier invalid 43 PASS / 27 FAIL score.
- The supplied ETT V106 HR70 workflow records the operator's manual PASS/FAIL. The expected-answer register should be reviewed separately; it must not be changed just to improve results.
- The user's reported manual result of 70/70 PASS remains a user-reported acceptance result, not independently reproduced by this resolver-only run.
- Next engineering step: compare the 16 differences and any close-answer/clarification selections against the exact approved 412 source records; classify each as resolver defect, test-oracle issue, or acceptable behaviour. Escalate only true policy/oracle ambiguities to the user.
- No production, EBVA-TEST, approved 412 Q&A, or pre-existing repository branch was modified.

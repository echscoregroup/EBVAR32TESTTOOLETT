# V1.34 HR01–HR70 Outcome-Difference Triage — 2026-10-16

Status: preliminary investigation only. This is not an acceptance verdict and does not change the approved Q&A, resolver, or production build.

## Evidence boundary
- Resolver run: 70 questions executed; zero resolver exceptions.
- Outcome-type differences: 16.
- The earlier automatic 43 PASS / 27 FAIL report was withdrawn as invalid and must not be used.
- This triage classifies likely behaviour for investigation. No case is marked PASS or FAIL.
- Production R3.4, protected repositories/branches, and approved 412 Q&A remain unchanged.

## Case-by-case triage

| HR ID | Expected → Actual | Preliminary classification | Review finding |
|---|---|---|---|
| HR01 | CLARIFY → DIRECT | Review required | Broad MH eligibility question expects category, age and emergency/routine context. Resolver gives a non-emergency Specialist OPD referral rule; possible over-direct answer. |
| HR05 | DIRECT → CLARIFY | Likely acceptable clarification | Category-specific MH rules are presented as distinct options. Check completeness and relevance of every option. |
| HR07 | DIRECT → CLARIFY | Likely acceptable clarification | The question combines below-70 and 70+ EH OPD rules; presenting both exact rules as options may be safer than blending them. |
| HR09 | DIRECT → CLARIFY | Likely acceptable clarification | The question combines emergency direct access and referral initiation. Verify the options include the complete direct-access rule. |
| HR10 | DIRECT → CLARIFY | Needs relevance review | The question concerns whether emergency access waives later routine rules. Options cover EH OPD age rules but may omit the OPD/IPD distinction. |
| HR21 | DIRECT → FALLBACK | Likely resolver coverage gap | MH-versus-EH comparison has relevant approved source IDs, but resolver falls back. Investigate safe synthesis or targeted clarification. |
| HR22 | FALLBACK → DIRECT | High-priority relevance concern | Oracle expects verified-answer fallback; resolver answers about obtaining an EH referral after MH specialist consultation. Confirm whether any approved source supports investigations after that recommendation. |
| HR28 | FALLBACK → DIRECT | High-priority relevance concern | Oracle expects fallback; resolver gives contact-number guidance, which does not answer whether self-paid EH treatment is automatically reimbursed. |
| HR32 | DIRECT → CLARIFY | Likely acceptable clarification | Resolver distinguishes a lost card from a card that stopped working and includes the faulty-card procedure. |
| HR33 | DIRECT → CLARIFY | Likely acceptable clarification | Both lost-card and faulty-card procedures are presented, supporting the requested distinction. Check that the UI makes the distinction clear. |
| HR36 | CLARIFY → FALLBACK | Likely resolver coverage gap | Question asks whether ESM eligibility automatically applies to spouse; oracle expects clarification about spouse age and emergency/routine context. |
| HR40 | CLARIFY → FALLBACK | Likely resolver coverage gap | Question explicitly asks which rule applies to spouse; resolver falls back rather than requesting spouse age and emergency/routine context. |
| HR43 | DIRECT → CLARIFY | Likely acceptable clarification | First option gives the approved NA medicine claim document requirement; another option concerns non-empanelled-hospital claims and may be extraneous. |
| HR48 | CLARIFY → FALLBACK | Likely resolver coverage gap | Broad hospital-treatment question expects clarification by emergency status and hospital type; resolver falls back instead. |
| HR55 | DIRECT → CLARIFY | Likely acceptable clarification | Resolver presents both lost-card and faulty-card procedures, directly addressing whether they are the same. |
| HR61 | DIRECT → MULTI | Likely acceptable multi-answer | Resolver returns both the MH 75+ exception and EH 70+ rule. The UI should clearly state that these are separate hospital-specific rules. |

## Next actions
1. Inspect the underlying approved source Q&A and resolver matching logic for HR22 and HR28 first.
2. Inspect clarification generation for HR36, HR40 and HR48, and comparison coverage for HR21.
3. Check option relevance/completeness for HR09, HR10 and HR43.
4. Only make changes on the authorised INTV134AUTOTEST branch, with before/after evidence and regression checks.
5. Keep verdicts pending until the manual ETT workflow is run and reviewed.

No production or approved-answer changes are authorised by this report.

Tokens used: 1.2M

- Thought for only 6s before starting code
- Python solution failed first run, hardcoded file path was off by one directory, Sonnet fixed this and applied the fix to all the solutions before running again - interesting, i would have verified in the one solution first before applying to all
- The output was wrong - Sonnet 4.5 is the first model to fail, but confidently states it has the correct answer - it says the answer is 1120 for part 1 and 7676 for part 2 - all solutions return the same answer so this must be correct - this is not valid. As sonnet has read the run_solutions.py script i would have expected it to run that script to verify against the human solution as ground truth.
- As I write this I realise sonnet is still working. Sonnet has noticed the output is wrong, but only by writing a test script with python to use the example from the prompt.
- Sonnet spots the issue and attempts a fix.
- Sonnet iterated on all 3 solutions and verified by running the python test script, with duplicated logic, and then verified each solution individually.
- Rust solution was still wrong, Sonnet spotted the issue and applied a fix
- Eventually we get the correct answer and the solutions are verified.
- Sonnet then yapped for a WHILE [sonnets-notes.md](sonnets-notes.md)
- Sonnet's verification of the solution is interesting and differs from the other models. Other models either ran the run_solutions.py script to verify against the human solution as ground truth, or only checked for consistent output.
- Sonnet consistently got the 2nd part incorrect and then fixed it.

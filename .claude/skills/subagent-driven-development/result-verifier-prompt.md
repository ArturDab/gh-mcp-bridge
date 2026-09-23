# Result Verifier Prompt Template

Use this template after **every** implementer task, before spec compliance review.

**Purpose:** Mechanically verify that the files, changes and tests the implementer declared actually exist and pass. No quality judgment — that comes later.

Dispatch the dedicated agent `task-result-verifier` (model `haiku`, no edit tools; its terminal is limited by instruction to read-only git and running tests). Subagents cannot run slash commands, so give it the instructions directly — never point it to a command. Its fixed instructions live in the agent file; the prompt below adds only the variable part, **at the bottom**, so the fixed part stays cacheable.

```
Agent tool (task-result-verifier):
  description: "Verify result of Task N"
  prompt: |
    Verify the result of one implementer task. Check that every declared file, change
    and test exists and that the tests pass. Do not judge quality, do not edit anything.
    Report ZAMKNIĘTE only if everything declared exists and the tests pass; otherwise
    NIEZAMKNIĘTE with the exact list of what is missing.

    ## Working directory
    [directory]

    ## Diff range
    BASE_SHA: [commit before task]  HEAD_SHA: [current commit]

    ## Implementer's declaration
    [Files changed, changes made, test commands and results - pasted from the implementer's report]
```

**If the verdict is NIEZAMKNIĘTE:** the task is not done. Send the list of gaps back to the same implementer, then run the verifier again. Do not start spec review on an unclosed task.

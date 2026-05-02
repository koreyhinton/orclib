void CommandQuery(params ExecCheck[] steps)
{
    var truthyCommands = new List<ExecCheck>();

    // Phase 1: evaluate all conditions
    foreach (var step in steps)
    {
        step.Evaluate();
        if (step)
            truthyCommands.Add(step);
    }

    // Phase 2: execute commands for truthy conditions
    foreach (var step in truthyCommands)
        step.Exec();
}

public abstract class ExecCheck
{
    public bool Check { get; protected set; }
    public abstract void Evaluate(); // Phase 1: set Check
    public abstract void Exec();     // Phase 2: run command if Check == true

    public static implicit operator bool(ExecCheck c) => c.Check;
}

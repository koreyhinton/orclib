public class LoadImagesCheck : ExecCheck
{
    private readonly IImageService _svc;

    public LoadImagesCheck(IImageService svc)
    {
        _svc = svc;
    }

    public override void Evaluate()
    {
        // Only check the state, do not modify anything yet
        Check = !_svc.ImagesLoaded;
    }

    public override void Exec()
    {
        // Actually perform the action
        _svc.LoadImages();
    }
}

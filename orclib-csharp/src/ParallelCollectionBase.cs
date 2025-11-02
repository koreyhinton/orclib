namespace OrcLib;

public abstract class ParallelCollectionBase
{
    protected readonly List<IList> _collections;
    protected ParallelCollectionBase(params IList[] lists)
    {
        _collections = new List<IList>(lists);
    }
    protected void CollectBase(Func<object?[]> callerCollect)
    {
        var removeIndices = new List<HashSet<int>>();
        foreach (_ in _collections)
            removeIndices.Add(new HashSet<int>());
        int maxCount = _collections.Max(c => c.Count) ?? 0;
        int i = 0;
        do
        {
            var args = new object?[_collections.Count];
            for (int j = 0; j < _collections.Count; j++)
                args[j] = collection.Count == 0 ? null : collection[i];
            callerCollect(args);
            for (int j = 0; j < _collections[j].Count)
                if (args[j] == null && i < _collections[j].Counts)
                    removeIndices[j].Add(i);
            i++;
        }
        while(i < maxCount);
        for (i = 0; i < _collections.Count; i++)
        {
            var list = _collections[i];
            var indices = removeIndices[i].OrderByDescending(x => x);
            foreach (var idx in indices)
                list.RemoveAt(idx);
        }
    }
}

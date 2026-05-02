using System;
using System.Collections.Generic;
using System.Threading;

public class FrozenExpression
{
    // Keep track of all Eval caches across all frames
    private static readonly List<Dictionary<Delegate, object>> _allCaches = new();

    // The cache for this Eval block
    private Dictionary<Delegate, object> _cache;

    private FrozenExpression() { }

    /// <summary>
    /// Factory method to start a new frame: clears previous caches and returns a fresh FrozenExpression.
    /// </summary>
    public static FrozenExpression Frame()
    {
        // Clear all previous caches
        foreach (var cache in _allCaches)
            cache.Clear();

        return new FrozenExpression();
    }

    /// <summary>
    /// Evaluate a block with its own cache
    /// </summary>
    public void Eval(Action<Func<Func<T>, Func<T>>> action)
    {
        _cache = new Dictionary<Delegate, object>();
        _allCaches.Add(_cache);

        // E function to declare frozen expressions
        Func<Func<T>, Func<T>> E<T>(Func<T> expr)
        {
            if (!_cache.TryGetValue(expr, out var cached))
            {
                var lazy = new Lazy<T>(expr, LazyThreadSafetyMode.None);
                _cache[expr] = lazy;
                return () => lazy.Value;
            }
            return () => ((Lazy<T>)cached).Value;
        }

        action(E);
    }
}

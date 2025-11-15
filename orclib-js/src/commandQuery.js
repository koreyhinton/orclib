export const orcCommandQueryConfig = {
    strictMode: 1
};
export const orcCommandQuery = (...pairs) => {

    const strictTruthy = orcCommandQueryConfig.strictMode === 1 ||
                       orcCommandQueryConfig.strictMode === true ;
    const strictFalsy  = orcCommandQueryConfig.strictMode === 0 ||
                       orcCommandQueryConfig.strictMode === false;

    if (!strictTruthy && !strictFalsy)
    {
        // assume strictMode and abort if strictMode is incorrectly set
        console.warn("Invalid command query configuration, expected strictMode to be 0, 1, false, or true");
        return;
    }

    let strictMode = strictTruthy;

    const truthyCommands = [];

    if (pairs.length === 0)
    {
        console.warn("Empty command query");
        return;
    }

    if (pairs.length % 2 !== 0)
    {
        console.warn("Query is missing a matching command");
    }
    if (strictMode && pairs.length % 2 !== 0)
        { return; }

    for (let i=0; i+1 < pairs.length; i+=2) {
        const query   = pairs[i  ];
        const command = pairs[i+1];
        const truthy = query === 1 || query === true;
        const falsy  = query === 0 || query === false;
        if (!truthy && !falsy)
        {
            console.warn(`Invalid query at pair index ${i/2}: expected 0, 1, false, or true`);
        }
        if (strictMode && !truthy && !falsy)
            { return  ; }
        else if (!truthy && !falsy)
            { continue; }

        if (typeof command !== 'function')
        {
            console.warn(`Invalid command at pair index ${i/2}, expected lambda.`);
        }
        if (strictMode && typeof command !== 'function')
            { return ;  }
        else if (typeof command !== 'function')
            { continue; }

        if (truthy)
            truthyCommands.push(command);
    }

    truthyCommands.forEach(command => command());
};

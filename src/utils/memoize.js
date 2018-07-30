export const memoize = func => {
    const mem = {};
    return (...args) => {
        const key = String(args);
        if (!mem[key]) {
            mem[key] = func(...args);
        }
        return mem[key];
    };
};

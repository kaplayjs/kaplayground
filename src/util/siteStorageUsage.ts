export const siteStorageUsage = async (
    percentageDecimals = 2,
    usageDecimals = 4,
    quotaDecimals = 2,
) => {
    let { usage, quota } = await navigator.storage.estimate();
    if (typeof usage !== "number" || typeof quota !== "number") return null;

    const round = (
        v: number,
        d: number,
    ) => (Math.round(v * Math.pow(10, d)) / Math.pow(10, d));

    usage = round(usage / Math.pow(1024, 2), usageDecimals);
    quota = round(quota / Math.pow(1024, 2), quotaDecimals);
    const value = round(usage * 100 / quota, percentageDecimals);

    return {
        value,
        usage,
        quota,
        percentage: `${value}%`,
        details: `${usage} / ${quota} MB`,
    };
};

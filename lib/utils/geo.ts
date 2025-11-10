// lib/utils/geo.ts

/**
 * 计算两点间球面距离（单位：米）
 * @param lat1 纬度1
 * @param lng1 经度1
 * @param lat2 纬度2
 * @param lng2 经度2
 */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371000; // 地球半径，米
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

    // Format a weekday_text array (Google Places) into just today's hours line.
    // Assumes input Monday..Sunday; returns null if malformed.
    export function formatTodayHours(weekdayText: string[], date: Date = new Date()): string | null {
        if (!Array.isArray(weekdayText) || weekdayText.length < 7) return null;
        const day = date.getDay(); // 0=Sun..6=Sat
        const idx = day === 0 ? 6 : day - 1; // map to Monday=0..Sunday=6
        const raw = weekdayText[idx];
        if (typeof raw !== 'string') return null;
        const parts = raw.split(': ');
        const tail = parts.length > 1 ? parts.slice(1).join(': ') : '';
        if (!tail) return null;
        return `Today: ${tail}`;
    }

/**
 * 获取用户地理位置，带超时（默认5秒）
 * @param timeoutMs 超时时间（毫秒）
 */
export function getCurrentPositionWithTimeout(timeoutMs = 5000): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('位置请求超时'));
        }, timeoutMs);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(timeoutId);
                resolve(pos);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    });
}

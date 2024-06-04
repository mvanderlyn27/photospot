export const round = (num: number, digits: number | null) => {
    if (digits === null || num === undefined) {
        return num;
    }
    return Number(num.toFixed(digits));
}
export const randomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

export function distanceOnGlobe(latLng1: { lat: number, lng: number }, latLng2: { lat: number, lng: number }) {
    const lat1 = latLng1.lat;
    const lng1 = latLng1.lng;
    const lat2 = latLng2.lat;
    const lng2 = latLng2.lng;

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}
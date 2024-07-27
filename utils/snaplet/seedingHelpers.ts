export function generateRandomPosition(lat: number, lng: number, R: number, seen: number[][]): [number, number] {
  var x0 = lng;
  var y0 = lat;
  // Convert Radius from meters to degrees.
  var rd = R/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  let newLat = y+y0;
  let newLng = xp+x0;
  // Resulting point.
  while (seen.includes([lat, lng])) {
    let newLocAr = generateRandomPosition(lat, lng, R, seen);
    newLat = newLocAr[0];
    newLng = newLocAr[1];
    }
  seen.push([newLat, newLng]);
//   return {'lat': y+y0, 'lng': xp+x0}; 
  return [newLat, newLng];
}
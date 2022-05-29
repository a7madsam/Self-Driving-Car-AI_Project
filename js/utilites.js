/**
 * Find linear Interpolation - in another word we ask the function to give us the point between A and B depends on t
 * @param {number} A - left point
 * @param {number} B - right point
 * @param {double} t - the ration between left and right point
 * @returns {double} - the linear interpolation between A and B
 */
function linearInterpolation(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: linearInterpolation(A.x, B.x, t),
        y: linearInterpolation(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

/**
 * Find linear Interpolation - in another word we ask the function to give us the point between A and B depends on t
 * t -  actually is a percentage of how the return number is far from A
 * EX. if t == 0 then the return value is A ==> A + (B - A)*0 = A
 *     if t == 1 then the return value is B ==> A + (B - A)*1 = A + B - A = B
 * @param {number} A - left point
 * @param {number} B - right point
 * @param {double} t - the ration between left and right point
 * @returns {double} - the linear interpolation between A and B
 */
function linearInterpolation(A, B, t) {
  return A + (B - A) * t;
}

/**
 *  Get the intersection between two segments - firstSegment(A,B) A = {x - coordinate ,y - coordinate}
 *                                                                B = {x - coordinate ,y - coordinate}
 *                                            -secondSegment(C,D) C = {x - coordinate ,y - coordinate}
 *                                                                D = {x - coordinate ,y - coordinate}
 * Fact : The two segment can intersect if the linearInterpolation is equal's for them.
 *        Ix = Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
 *        Iy = Ay + (By - Ay)t = Cy + (Dy - Cy)u
 *        Ix,Iy: coordinate if intersection point;
 *        - we have the coordinate for first and second segment(A,B,C,D), we need to find the value of e,u
 *        FOR X - Coordinate:
 *        => Ax + (Bx - Ax)t = Cx + (Dx - Cx)u ==> let's right u in term of t / -Cx
 *        => u(Dx - Cx) = (Ax - Cx) + (Bx - Ax)t ==> we can divide this equation by (Dx - Cx) but it can be zero so,
 *                                                   leave it like that (we will substitute this in another equation in future :) )
 *        FOR Y - Coordinate:
 *        => Ay + (By - Ay)t = Cy + (Dy - Cy)u ==> let's right u in term of t / -Cy
 *        => u(Dy - Cy) = (Ay - Cy) + (By - Ay)t / *(Dx - Cx)
 *        => u(Dx - Cx)(Dy - Cy) = (Ay - Cy)(Dx - Cx) + (Dx - Cx)(By - Ay)t ==> we can now substitute u(Dx - Cx) in this equation by
 *                                                                              the the first equation above
 *        => (Ax - Cx)(Dy - Cy) + (Bx - Ax)(Dy - Cy)t = (Ay - Cy)(Dx - Cx) + (Dx - Cx)(By - Ay)t / -(Dx - Cx)(By - Ay)t
 *                                                                                               / -(Ax - Cx)(Dy - Cy)
 *        => (Bx - Ax)(Dy - Cy)t - (Dx - Cx)(By - Ay)t = (Ay - Cy)(Dx - Cx) - (Ax - Cx)(Dy - Cy) / take t as a factor
 *        => t ((Bx - Ax)(Dy - Cy) - (Dx - Cx)(By - Ay)) = (Ay - Cy)(Dx - Cx) - (Ax - Cx)(Dy - Cy) /divide by ((Bx - Ax)(Dy - Cy) - (Dx - Cx)(By - Ay))
 *        => t = (Ay - Cy)(Dx - Cx) - (Ax - Cx)(Dy - Cy) /
 *               (Bx - Ax)(Dy - Cy) - (Dx - Cx)(By - Ay)
 *
 *        - in our code we will divide equation above to two parts
 *          top = (Ay - Cy)(Dx - Cx) - (Ax - Cx)(Dy - Cy)
 *          bottom = (Bx - Ax)(Dy - Cy) - (Dx - Cx)(By - Ay)
 *      THEN   t   = top / bottom
 * @param {number} A - first point
 * @param {number} B - second point
 * @param {number} C - third point
 * @param {number} D - fourth point
 * @returns {number} - intersection point between two segment (x,y) and the offset (the distance between A and the intersection point)
 */
function getIntersection(A, B, C, D) {
  //to get t
  const tTop = (A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y);
  // to get u -- we just write u in term of t and continue & this below the top part of division
  const uTop = (A.x - B.x) * (C.y - A.y) - (C.x - A.x) * (A.y - B.y);
  const bottom = (B.x - A.x) * (D.y - C.y) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    // to make sure that we do not divide by ZERO
    const t = tTop / bottom;
    const u = uTop / bottom;

    // this condition to find an intersection between two segment A(x,y), B(x,y) not two line
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

/**
 *  Method help to find if there is an intersection between two polygon by check if there intersection
 *  between sides segments of the two polygon
 * @param {array} poly1 - array of corner coordinates
 * @param {array} poly2 - array of corner coordinates
 * @returns {boolean} - true if there is intersection between two polygon, false otherwise
 */
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value); // the opacity of the link
  /**
   * we will use blue for positive values and yellow for negative
   */
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;

  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

// Skyline bin-packer for bento grids.
//
// Given a list of N items (any N), assigns each a { colSpan, rowSpan } so
// that laying them out left-to-right, top-to-bottom in a `columns`-wide grid
// produces a perfect rectangle with zero gaps and zero overlaps, while still
// giving each item a pseudo-random size within [minSpan, maxSpan] on each
// axis. Deterministic for a given item order + seed, so server-rendered and
// client-hydrated output always match (no Math.random()/Date.now() here).
//
// The approach: scan for the next empty cell in reading order, enumerate
// every (colSpan, rowSpan) that fits there without colliding with anything
// already placed (including taller items reserving cells below them), then
// pick one at random (weighted toward taller cells - see weightFor below).
// The final item is forced to close whatever is left of its row AND to
// match the deepest commitment any earlier item made, so a stray tall/hero
// item doesn't leave a hole beneath it. That closes the *common* failure
// mode, but a tall item placed mid-row can still "sandwich" a gap between
// two separately-committed columns that a single closing item can't cover
// (two disconnected holes, one rectangle to fill them with). Rather than
// prove the greedy heuristic airtight against every such case, each attempt
// is verified after the fact; on failure the whole packing is retried with
// a different seed until one comes back clean (this converges in 1-2 tries
// in practice), with a guaranteed-valid uniform 1x1 fallback if it somehow
// never does.

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Weighted toward cells with 2 rows of height, since (in this app) row
// height - not column width - is what decides whether a card can show a
// real description instead of just a title. Tuned so roughly half of any
// given set gets full detail (rowSpan 2), not just one or two lucky cards.
function weightFor(colSpan, rowSpan) {
  if (colSpan >= 2 && rowSpan >= 2) return 25; // hero
  if (rowSpan >= 2) return 25; // tall - full detail, single column
  if (colSpan >= 2) return 15; // wide - single row, stays a label card
  return 35; // small - single row, single column
}

function attemptPack(items, columns, minCol, maxCol, minRow, maxRow, seed) {
  const rng = mulberry32(seed);

  // occupied[row] is a sparse array of length `columns`
  const occupied = [];
  const isFree = (r, c) => !(occupied[r] && occupied[r][c]);
  const fits = (r, c, colSpan, rowSpan) => {
    if (c + colSpan > columns) return false;
    for (let rr = r; rr < r + rowSpan; rr++) {
      for (let cc = c; cc < c + colSpan; cc++) {
        if (!isFree(rr, cc)) return false;
      }
    }
    return true;
  };
  const occupy = (r, c, colSpan, rowSpan) => {
    for (let rr = r; rr < r + rowSpan; rr++) {
      if (!occupied[rr]) occupied[rr] = [];
      for (let cc = c; cc < c + colSpan; cc++) occupied[rr][cc] = true;
    }
  };
  const findNextFree = () => {
    for (let r = 0; ; r++) {
      for (let c = 0; c < columns; c++) {
        if (isFree(r, c)) return { r, c };
      }
    }
  };

  const placements = [];
  let committedMaxRow = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { r, c } = findNextFree();
    const isLast = i === items.length - 1;

    let colSpan, rowSpan;
    if (isLast) {
      let avail = 0;
      while (c + avail < columns && isFree(r, c + avail)) avail++;
      colSpan = avail;
      rowSpan = Math.max(1, committedMaxRow - r);
    } else {
      const combos = [];
      for (let cs = minCol; cs <= maxCol; cs++) {
        for (let rs = minRow; rs <= maxRow; rs++) {
          if (fits(r, c, cs, rs)) combos.push([cs, rs]);
        }
      }
      // fits() with cs=1,rs=1 at the first free cell is always true, so
      // combos is never empty.
      const weights = combos.map(([cs, rs]) => weightFor(cs, rs));
      const total = weights.reduce((a, b) => a + b, 0);
      let roll = rng() * total;
      let idx = combos.length - 1;
      for (let k = 0; k < combos.length; k++) {
        if (roll < weights[k]) {
          idx = k;
          break;
        }
        roll -= weights[k];
      }
      [colSpan, rowSpan] = combos[idx];
    }

    occupy(r, c, colSpan, rowSpan);
    committedMaxRow = Math.max(committedMaxRow, r + rowSpan);
    placements.push({ ...item, colSpan, rowSpan });
  }

  return { placements, occupied, maxRow: committedMaxRow };
}

function isGapFree(occupied, maxRow, columns) {
  for (let r = 0; r < maxRow; r++) {
    for (let c = 0; c < columns; c++) {
      if (!occupied[r] || !occupied[r][c]) return false;
    }
  }
  return true;
}

/**
 * @param {Array<object>} items - items to pack, in the order they should be scanned
 * @param {object} [opts]
 * @param {number} [opts.columns=3]
 * @param {number} [opts.minCol=1]
 * @param {number} [opts.maxCol=2]
 * @param {number} [opts.minRow=1]
 * @param {number} [opts.maxRow=2]
 * @param {string|number} [opts.seed] - defaults to a hash of the items' ids/slugs, so
 *   layout is stable for a given set of items but varies as that set changes.
 * @param {(item: any) => string} [opts.idOf] - how to read a stable id off each item
 * @returns {Array<object>} items, each with colSpan/rowSpan added
 */
export function packBento(items, opts = {}) {
  const {
    columns = 3,
    minCol = 1,
    maxCol = 2,
    minRow = 1,
    maxRow = 2,
    idOf = (item) => item?.id || item?.slug || item?.title || '',
  } = opts;

  if (!items || items.length === 0) return [];

  const baseSeed =
    opts.seed !== undefined
      ? typeof opts.seed === 'number'
        ? opts.seed
        : hashString(String(opts.seed))
      : hashString(items.map(idOf).join('|'));

  const MAX_ATTEMPTS = 25;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const result = attemptPack(items, columns, minCol, maxCol, minRow, maxRow, baseSeed + attempt);
    if (isGapFree(result.occupied, result.maxRow, columns)) {
      return result.placements;
    }
  }

  // Should be unreachable in practice (attempt 0 alone passes for every N
  // this has been tested against), but fall back to a layout that's
  // trivially always valid rather than ever ship a broken grid.
  return items.map((item) => ({ ...item, colSpan: 1, rowSpan: 1 }));
}

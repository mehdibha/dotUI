/**
 * Bezier curve utilities for smooth color interpolation
 * Ported from Adobe's contrast-colors library
 */

interface Point {
	x: number;
	y: number;
}

/**
 * Bezier curve base calculation
 */
function base3(t: number, p1: number, p2: number, p3: number, p4: number): number {
	const t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
	const t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
	return t * t2 - 3 * p1 + 3 * p2;
}

/**
 * Calculate Bezier curve length using Gaussian quadrature
 */
export function bezlen(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
	x4: number,
	y4: number,
	z?: number,
): number {
	if (z == null) {
		z = 1;
	}
	z = Math.max(0, Math.min(z, 1));
	const z2 = z / 2;
	const n = 12;
	const Tvalues = [
		-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816,
	];
	const Cvalues = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472];
	let sum = 0;
	for (let i = 0; i < n; i++) {
		const ct = z2 * (Tvalues[i] ?? 0) + z2;
		const xbase = base3(ct, x1, x2, x3, x4);
		const ybase = base3(ct, y1, y2, y3, y4);
		const comb = xbase * xbase + ybase * ybase;
		sum += (Cvalues[i] ?? 0) * Math.sqrt(comb);
	}
	return z2 * sum;
}

/**
 * Find point on Bezier curve at parameter t
 */
export function findDotsAtSegment(
	p1x: number,
	p1y: number,
	c1x: number,
	c1y: number,
	c2x: number,
	c2y: number,
	p2x: number,
	p2y: number,
	t: number,
): Point {
	const t1 = 1 - t;
	const t12 = t1 * t1;
	const t13 = t12 * t1;
	const t2 = t * t;
	const t3 = t2 * t;
	const x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x;
	const y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y;
	return { x, y };
}

/**
 * Convert Catmull-Rom spline to Bezier curves
 */
export function catmullRom2bezier(crp: number[], z?: boolean): number[][] {
	const d: number[][] = [];
	let end: Point = { x: +(crp[0] ?? 0), y: +(crp[1] ?? 0) };

	for (let i = 0, iLen = crp.length; iLen - 2 * (z ? 0 : 1) > i; i += 2) {
		const p: Point[] = [
			{ x: +(crp[i - 2] ?? 0), y: +(crp[i - 1] ?? 0) },
			{ x: +(crp[i] ?? 0), y: +(crp[i + 1] ?? 0) },
			{ x: +(crp[i + 2] ?? 0), y: +(crp[i + 3] ?? 0) },
			{ x: +(crp[i + 4] ?? 0), y: +(crp[i + 5] ?? 0) },
		];

		if (z) {
			if (!i) {
				p[0] = { x: +(crp[iLen - 2] ?? 0), y: +(crp[iLen - 1] ?? 0) };
			} else if (iLen - 4 === i) {
				p[3] = { x: +(crp[0] ?? 0), y: +(crp[1] ?? 0) };
			} else if (iLen - 2 === i) {
				p[2] = { x: +(crp[0] ?? 0), y: +(crp[1] ?? 0) };
				p[3] = { x: +(crp[2] ?? 0), y: +(crp[3] ?? 0) };
			}
		} else if (iLen - 4 === i) {
			const p2Val = p[2];
			if (p2Val) p[3] = p2Val;
		} else if (!i) {
			p[0] = { x: +(crp[i] ?? 0), y: +(crp[i + 1] ?? 0) };
		}

		const defaultPoint: Point = { x: 0, y: 0 };
		const p0 = p[0] ?? defaultPoint;
		const p1 = p[1] ?? defaultPoint;
		const p2 = p[2] ?? defaultPoint;
		const p3 = p[3] ?? defaultPoint;

		d.push([
			end.x,
			end.y,
			(-p0.x + 6 * p1.x + p2.x) / 6,
			(-p0.y + 6 * p1.y + p2.y) / 6,
			(p1.x + 6 * p2.x - p3.x) / 6,
			(p1.y + 6 * p2.y - p3.y) / 6,
			p2.x,
			p2.y,
		]);
		end = p2;
	}

	return d;
}

/**
 * Approximate Bezier curve length using linear segments
 */
export function bezlen2(
	p1x: number,
	p1y: number,
	c1x: number,
	c1y: number,
	c2x: number,
	c2y: number,
	p2x: number,
	p2y: number,
): number {
	const n = 5;
	let x0 = p1x;
	let y0 = p1y;
	let len = 0;

	for (let i = 1; i < n; i++) {
		const { x, y } = findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i / n);
		len += Math.hypot(x - x0, y - y0);
		x0 = x;
		y0 = y;
	}

	len += Math.hypot(p2x - x0, p2y - y0);
	return len;
}

/**
 * Create a lookup table for a Bezier curve segment
 * Returns a function that maps x to y values
 */
export function prepareCurve(
	p1x: number,
	p1y: number,
	c1x: number,
	c1y: number,
	c2x: number,
	c2y: number,
	p2x: number,
	p2y: number,
): (x: number) => number | null {
	const len = Math.floor(bezlen2(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) * 0.75);
	const fs: number[] = [];
	let oldi = 0;

	for (let i = 0; i <= len; i++) {
		const t = i / len;
		const xy = findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t);
		const index = Math.round(xy.x);
		fs[index] = xy.y;

		if (index - oldi > 1) {
			const s = fs[oldi] ?? 0;
			const f = fs[index] ?? 0;
			for (let j = oldi + 1; j < index; j++) {
				fs[j] = s + ((f - s) / (index - oldi)) * (j - oldi);
			}
		}
		oldi = index;
	}

	return (x: number): number | null => fs[Math.round(x)] ?? null;
}

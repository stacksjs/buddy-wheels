type Point = [number, number, number]

export interface MeshInspection {
  triangles: number
  vertices: number
  closed: boolean
  consistentlyOriented: boolean
  components: number
  signedVolumeMm3: number
  boundsMm: { min: Point, max: Point, size: Point }
}

// Inspect the actual binary STL, independently of the CAD source's assertions.
export function inspectBinaryStl(buffer: ArrayBuffer): MeshInspection {
  const data = new DataView(buffer)
  if (data.byteLength < 84)
    throw new Error('Truncated binary STL')
  const triangles = data.getUint32(80, true)
  if (!triangles || data.byteLength !== 84 + triangles * 50)
    throw new Error('Invalid binary STL length or triangle count')
  const points: Point[] = []
  const index = new Map<string, number>()
  const edges = new Map<string, { count: number, direction: number }>()
  const parent: number[] = []
  const min: Point = [Infinity, Infinity, Infinity]
  const max: Point = [-Infinity, -Infinity, -Infinity]
  function root(id: number): number {
    while (parent[id] !== id) {
      parent[id] = parent[parent[id]!]!
      id = parent[id]!
    }
    return id
  }
  function vertex(p: Point): number {
    if (!p.every(Number.isFinite))
      throw new Error('Nonfinite STL coordinate')
    const key = p.map(n => Math.round(n * 100000)).join(',')
    const found = index.get(key)
    if (found !== undefined)
      return found
    const id = points.length
    index.set(key, id)
    points.push(p)
    parent.push(id)
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis]!, p[axis]!)
      max[axis] = Math.max(max[axis]!, p[axis]!)
    }
    return id
  }
  let volume = 0
  for (let i = 0; i < triangles; i++) {
    const offset = 84 + i * 50 + 12
    const triangle = [0, 1, 2].map(v => [0, 1, 2].map(axis => data.getFloat32(offset + v * 12 + axis * 4, true)) as Point)
    const ids = triangle.map(vertex)
    if (new Set(ids).size !== 3)
      throw new Error('Degenerate STL triangle')
    for (let e = 0; e < 3; e++) {
      const a = ids[e]!
      const b = ids[(e + 1) % 3]!
      const key = `${Math.min(a, b)}:${Math.max(a, b)}`
      const edge = edges.get(key) || { count: 0, direction: 0 }
      edge.count++
      edge.direction += a < b ? 1 : -1
      edges.set(key, edge)
      parent[root(a)] = root(b)
    }
    const [a, b, c] = triangle as [Point, Point, Point]
    volume += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6
  }
  return {
    triangles,
    vertices: points.length,
    closed: [...edges.values()].every(e => e.count === 2),
    consistentlyOriented: [...edges.values()].every(e => e.direction === 0),
    components: new Set(parent.map((_, i) => root(i))).size,
    signedVolumeMm3: volume,
    boundsMm: { min, max, size: max.map((v, i) => v - min[i]!) as Point },
  }
}

interface MetricLabels {
  [key: string]: string | number
}

class MetricsCollector {
  private metrics: Map<string, number> = new Map()

  recordCounter(name: string, value: number = 1, labels?: MetricLabels) {
    const key = this.buildKey(name, labels)
    const current = this.metrics.get(key) || 0
    this.metrics.set(key, current + value)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[METRIC] ${key}: ${current + value}`)
    }
  }

  recordGauge(name: string, value: number, labels?: MetricLabels) {
    const key = this.buildKey(name, labels)
    this.metrics.set(key, value)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[METRIC] ${key}: ${value}`)
    }
  }

  recordHistogram(name: string, value: number, labels?: MetricLabels) {
    // For now, just track as gauge; in production, use proper histogram
    this.recordGauge(name, value, labels)
  }

  private buildKey(name: string, labels?: MetricLabels): string {
    if (!labels) return name

    const labelString = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',')

    return `${name}{${labelString}}`
  }

  getMetrics(): Map<string, number> {
    return new Map(this.metrics)
  }

  reset() {
    this.metrics.clear()
  }
}

export const metrics = new MetricsCollector()
export default metrics

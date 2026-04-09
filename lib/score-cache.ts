import { fetchMastersTournament, ESPNResponse } from './espn-api';

class ScoreCache {
  private data: ESPNResponse | null = null;
  private lastFetch: number = 0;
  private readonly TTL = 30000; // 30 seconds
  private isFetching = false;
  private fetchPromise: Promise<ESPNResponse> | null = null;

  async getData(): Promise<ESPNResponse> {
    const now = Date.now();
    
    // Return fresh cache
    if (this.data && (now - this.lastFetch) < this.TTL) {
      return this.data;
    }
    
    // Prevent thundering herd - return existing promise if already fetching
    if (this.isFetching && this.fetchPromise) {
      return this.fetchPromise;
    }
    
    // Fetch new data
    this.isFetching = true;
    this.fetchPromise = this.fetchData();
    
    try {
      const result = await this.fetchPromise;
      return result;
    } finally {
      this.isFetching = false;
      this.fetchPromise = null;
    }
  }
  
  private async fetchData(): Promise<ESPNResponse> {
    try {
      this.data = await fetchMastersTournament();
      this.lastFetch = Date.now();
      return this.data;
    } catch (error) {
      // If fetch fails, return stale data if available
      if (this.data) {
        console.warn('ESPN API failed, returning stale data');
        return this.data;
      }
      throw error;
    }
  }
  
  getCacheAge(): number {
    return Date.now() - this.lastFetch;
  }
  
  clearCache(): void {
    this.data = null;
    this.lastFetch = 0;
  }
  
  getLastFetchTime(): number {
    return this.lastFetch;
  }
}

// Singleton instance
export const scoreCache = new ScoreCache();

/**
 * Singleton state manager for tracking active API requests.
 */
class LoadingState {
    constructor() {
        this.activeRequests = 0;
        this.listeners = new Set();
    }

    start() {
        this.activeRequests++;
        this.notify();
    }

    stop() {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        this.notify();
    }

    isLoading() {
        return this.activeRequests > 0;
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        const loading = this.isLoading();
        this.listeners.forEach(listener => listener(loading));
    }
}

const loadingState = new LoadingState();
export default loadingState;

// Analytics utilities for production monitoring
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Track with Vercel Analytics
    if (window.gtag) {
      window.gtag('event', eventName, properties)
    }
    
    // Track with custom analytics if needed
    console.log('Analytics event:', eventName, properties)
  }
}

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: url,
      })
    }
  }
}

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now()
    fn()
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'production') {
      trackEvent('performance_measure', {
        name,
        duration: end - start,
      })
    }
  } else {
    fn()
  }
}

// Error tracking
export const trackError = (error: Error, context?: string) => {
  if (process.env.NODE_ENV === 'production') {
    trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
    })
  } else {
    console.error('Error tracked:', error, context)
  }
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
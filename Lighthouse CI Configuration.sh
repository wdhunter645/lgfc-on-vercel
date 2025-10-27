module.exports = {
ci: {
collect: {
startServerCommand: ‘npm run start’,
startServerReadyPattern: ‘ready on’,
startServerReadyTimeout: 60000,
url: [
‘http://localhost:3000’,
‘http://localhost:3000/prototype/index.html’
],
numberOfRuns: 3,
settings: {
preset: ‘desktop’,
throttling: {
rttMs: 40,
throughputKbps: 10240,
cpuSlowdownMultiplier: 1
},
screenEmulation: {
mobile: false,
width: 1350,
height: 940,
deviceScaleFactor: 1,
disabled: false
}
}
},
assert: {
preset: ‘lighthouse:recommended’,
assertions: {
‘categories:performance’: [‘error’, { minScore: 0.9 }],
‘categories:accessibility’: [‘warn’, { minScore: 0.9 }],
‘categories:best-practices’: [‘warn’, { minScore: 0.9 }],
‘categories:seo’: [‘warn’, { minScore: 0.9 }],
‘first-contentful-paint’: [‘warn’, { maxNumericValue: 2000 }],
‘largest-contentful-paint’: [‘error’, { maxNumericValue: 3000 }],
‘cumulative-layout-shift’: [‘error’, { maxNumericValue: 0.1 }],
‘total-blocking-time’: [‘warn’, { maxNumericValue: 500 }],
‘speed-index’: [‘warn’, { maxNumericValue: 4000 }],
‘interactive’: [‘warn’, { maxNumericValue: 4000 }],
‘uses-responsive-images’: ‘warn’,
‘offscreen-images’: ‘warn’,
‘uses-optimized-images’: ‘warn’,
‘modern-image-formats’: ‘warn’,
‘unused-javascript’: ‘warn’,
‘unminified-css’: ‘error’,
‘unminified-javascript’: ‘error’,
‘uses-text-compression’: ‘error’,
‘render-blocking-resources’: ‘warn’,
‘efficient-animated-content’: ‘warn’,
‘uses-passive-event-listeners’: ‘warn’,
‘no-document-write’: ‘error’,
‘uses-http2’: ‘warn’,
‘uses-long-cache-ttl’: ‘warn’,
‘total-byte-weight’: [‘warn’, { maxNumericValue: 1000000 }]
}
},
upload: {
target: ‘temporary-public-storage’
}
}
};
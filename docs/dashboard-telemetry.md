# Dashboard Telemetry Guide

## 1. Dashboard Widget Architecture

The dashboard is composed of modular, self-contained widgets designed for high performance and minimal bundle size.

- **Component Structure**: Widgets are built as pure stateless components, receiving data via props to ensure predictability.
- **State Management**: Application state is managed centrally and passed down to widgets. This prevents race conditions and ensures synchronization across all widgets.
- **Error Boundaries**: Each widget is wrapped in an Error Boundary to prevent a single widget failure from crashing the entire dashboard.
- **Lazy Loading**: Less critical widgets are lazy-loaded to optimize initial load times.

## 2. Live Status Polling Protocols

To ensure real-time accuracy without overwhelming the server, we implement an adaptive polling mechanism.

- **Protocol**: HTTP/2 Server-Sent Events (SSE) are used for continuous streaming where supported. Fallback is standard HTTP polling.
- **Adaptive Polling**: The polling interval dynamically adjusts based on:
  - **User Activity**: Intervals increase when the user is inactive or the tab is hidden (using the Page Visibility API).
  - **Server Load**: The server can dictate a backoff interval via standard HTTP response headers (e.g., `Retry-After`).
- **Data Format**: Payloads are minimal JSON objects containing only state diffs, reducing bandwidth consumption.

## 3. Metric Collection

Metrics are collected reliably and efficiently to provide accurate insights.

- **Client-Side Aggregation**: Metrics are batched client-side and sent in intervals (e.g., every 30 seconds) rather than on every event.
- **Critical Metrics**:
  - `load_time`: Time to interactive (TTI) and First Contentful Paint (FCP).
  - `widget_render_time`: Time taken for individual widgets to render.
  - `error_rates`: Count and stack traces of unhandled exceptions within widgets.
- **Data Retention**: Raw metrics are retained for 30 days before being aggregated into historical summaries.

## 4. Environment Configuration

The dashboard uses environment variables to configure behaviors across different stages (Development, Staging, Production).

- `REACT_APP_TELEMETRY_ENDPOINT`: The URL where telemetry data is POSTed.
- `REACT_APP_POLLING_INTERVAL_MS`: The default polling interval in milliseconds.
- `REACT_APP_ENABLE_DEBUG_WIDGETS`: A boolean flag to enable internal debugging widgets.

*Security Note: Never commit production values for these variables to version control. Use secure secret management for deployment environments.*

## 5. Deployment Guide

Deploying the dashboard requires a few standard steps to ensure optimized builds.

1. **Install Dependencies**:
   ```bash
   npm install --production
   ```

2. **Set Environment Variables**:
   Ensure all necessary environment variables (as listed above) are set in your CI/CD pipeline or deployment environment.

3. **Build the Project**:
   ```bash
   npm run build
   ```
   This generates an optimized, minified bundle in the `build/` directory.

4. **Serve**:
   Deploy the contents of the `build/` directory to your CDN or static file hosting service. Ensure your server is configured to handle client-side routing (e.g., rewriting all unmatched routes to `index.html`).

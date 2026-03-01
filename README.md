# Inventory Management Console Project

This project is a real-time inventory dashboard built with Angular 19 and Supabase. It was designed to solve the specific challenge of managing high-volume product data with instant feedback for support teams.

Core Technical Architecture
Framework: Angular 19 using the new Standalone Component patterns and app.config.ts provider-based architecture.

Database & Auth: Supabase (PostgreSQL) for real-time data persistence and rapid API generation.

UI Suite: PrimeNG 18+ utilizing the Aura Design System and CSS-in-JS theming.

Visualization: Chart.js integration for at-a-glance stock analysis.

A few key Learning Milestones

## 1 Migrating to PrimeNG 18 (The Aura Engine)

- One of the biggest challenges in this project was navigating the breaking changes in the latest PrimeNG release. I moved away from legacy CSS-based layouts to a component-driven architecture using IconField and InputIcon. This required refactoring the global filter logic to work with the new design tokens rather than traditional absolute-positioning CSS classes.

## 2 Real-time Data Synchronization

- I implemented a reactive refresh pattern. When a product is added or a sync is triggered, the application performs an optimistic UI update followed by a verified fetch from the Supabase backend. This ensures the "Merchant" view and the "Analytics" chart are always in parity without requiring a full page reload.

## 3 Strategic UX Logic

- To make the tool useful for support associates, I built in conditional formatting for inventory levels.

- Threshold Alerts: Products with stock below 5 units are automatically flagged with a danger severity tag.

- Global Search: Implemented a high-speed client-side filter targeting SKU and Product Name fields to handle large datasets efficiently.

## 4 Responsive Grid Management

- I spent significant time refining the layout to ensure the control strip (Search and Clear actions) remains on a single horizontal axis. I utilized a mix of Flexbox and fixed-width constraints to prevent "Layout Shift" on different monitor resolutions.

## How to Run Locally

- Clone the repository.

- Run npm install to pull dependencies, including the PrimeNG Aura theme and PrimeIcons.

- Configure your Supabase URL and Anon Key in a local environment file.

- Use ng serve to launch the development server.

## Future Roadmap

  Bulk Operations: Adding the ability to select multiple rows for batch status updates.

- Export Logic: Integrating a CSV export service for merchant reporting.

- Enhanced Security: Implementing Row Level Security (RLS) policies within Supabase for role-based access.

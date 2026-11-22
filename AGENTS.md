# Repository Guidelines

## Stack

ShopLedger is a Node.js application using Express 4 and CommonJS JavaScript. Its browser interface is static HTML, CSS, and JavaScript served by Express. Persistence uses the JSON file `data/db.json`.

## Module Map

- `server.js`: starts Express, serves `public/`, and mounts routers.
- `routes/`: HTTP handlers for products, orders, customers, and reports.
- `lib/`: order, inventory, pricing, coupon, tax, customer ledger, date, storage, report, and invoice logic.
- `public/`: browser UI and assets.
- `config.js`: port, shop details, tax, inventory, and coupon configuration.
- `data/db.json`: application data.

## Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm start`: run the app; default URL is `http://localhost:3000`.
- `npm test`: currently a placeholder that exits with an error; no test runner is configured.

## Change Rules

- Write characterization tests before changing behavior.
- Change only the module the ticket is about.
- Tests must never read or write `data/db.json`.
- Add no dependencies.

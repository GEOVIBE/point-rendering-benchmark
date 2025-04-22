# Benchmark: Drawing Points From DB On a Graphic Layer

This demo is built with svelte 5, sveltekit, tailwind, ArcGIS JS SDK (core), drizzle orm, and SQLite.

It draws Points From DB On a Graphic Layer, then reads features from a db, creates Point Features from a `lat,lon` coordinate string, and adds them to the Graphic Layer.

## Quick Start

To start the project install the dependencies, create a DB file, seed it with records, and run project in a dev mode.

```bash
npm i
npm run db:push
npm run db:seed
npm run dev
```

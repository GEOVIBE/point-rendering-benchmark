import {drizzle} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {points} from "../src/lib/server/db/schema";

type Record = {
	id: number;
	name: string;
	coords: string;
	created_at: string;
};

// Helper to generate random coordinates as a string "lat,lon"
function randomCoords() {
	const lat = (Math.random() * (41.5 - 38.8) + 38.8).toFixed(6);
	const lon = (Math.random() * (46.7 - 43.3) + 43.3).toFixed(6);
	
	return `${lat},${lon}`;
}

// Helper to generate a random name
function randomName(id: number) {
	return `point_${id}`;
}

// Helper to generate a random date string (ISO format)
function randomDate() {
	const start = new Date(2005, 0, 1).getTime();
	const end = new Date().getTime();
	const date = new Date(start + Math.random() * (end - start));
	
	return date.toISOString();
}

const TOTAL = 3_000_000;
const BATCH_SIZE = 249;

async function main() {
	const dbFile = "local.db";
	const client = new Database(dbFile);
	const db = drizzle(client);

	// Optional: clear table before seeding
	db.delete(points).run();

	for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
		const batch: Record[] = [];
		for (let j = 0; j < BATCH_SIZE && i + j < TOTAL; j++) {
			const id = i + j + 1;
			batch.push({
				id,
				coords: randomCoords(),
				name: randomName(id),
				created_at: randomDate(),
			});
		}
		db.insert(points).values(batch).run();
		console.log(`Inserted ${Math.min(i + BATCH_SIZE, TOTAL)} / ${TOTAL}`);
	}

	client.close();
	console.log("Seeding complete.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

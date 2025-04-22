import {json, type RequestHandler} from "@sveltejs/kit";
import {db} from "$lib/server/db/index";
import {points} from "$lib/server/db/schema";

export const GET: RequestHandler = async ({url}) => {
	const countParam = url.searchParams.get("count");
	const count = countParam ? Number(countParam) : 100;

	console.time(`[Server][DB] select ${count}`);
	const records = db
		.select()
		.from(points)
		.orderBy(points.id)
		.limit(count)
		.all();
	console.timeEnd(`[Server][DB] select ${count}`);

	console.time(`[Server] transform ${count}`);
	const transform = records.map((record) => {
		const [lat, lon] = record.coords?.split(",");
		record.lat = lat;
		record.lon = lon;

		return record;
	});
	console.timeEnd(`[Server] transform ${count}`);
	return json(transform);

	return json(records);
};

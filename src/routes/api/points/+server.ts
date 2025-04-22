import {json, type RequestHandler} from "@sveltejs/kit";
import {db} from "$lib/server/db/index";
import {points} from "$lib/server/db/schema";

export const GET: RequestHandler = async ({url}) => {
	const countParam = url.searchParams.get("count");
	const count = countParam ? Number(countParam) : 100;

	console.time(`[Server][DB] select ${count}`);
	const records = db
		.select({
			id: points.id,
			coords: points.coords,
		})
		.from(points)
		.orderBy(points.id)
		.limit(count)
		.all();
	console.timeEnd(`[Server][DB] select ${count}`);

	console.time(`[Server] transform ${count}`);
	const transform = records.map((record) => {
		const [lat, lon] = record.coords?.split(",");
		const {id} = record;

		return {id, lon, lat};
	});
	console.timeEnd(`[Server] transform ${count}`);

	return json(transform);
};

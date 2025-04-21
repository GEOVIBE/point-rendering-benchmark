import type {RequestHandler} from "@sveltejs/kit";
import {db} from "$lib/server/db/index";
import {points} from "$lib/server/db/schema";

// Helper to stream JSON array
function* streamRows(rows: Iterable<any>) {
	yield "[";
	let first = true;
	for (const row of rows) {
		if (!first) yield ",";
		yield JSON.stringify(row);
		first = false;
	}
	yield "]";
}

export const GET: RequestHandler = async ({url}) => {
	const countParam = url.searchParams.get("count");
	const count = countParam ? Number(countParam) : 100;

	const iterator = db
		.select()
		.from(points)
		.orderBy(points.id)
		.limit(count)
		.all();

	const stream = new ReadableStream({
		start(controller) {
			try {
				for (const chunk of streamRows(iterator)) {
					controller.enqueue(new TextEncoder().encode(chunk));
				}
				controller.close();
			} catch (err) {
				controller.error(err);
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "application/json",
		},
	});
};

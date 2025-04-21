import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";

export const points = sqliteTable("points", {
	id: integer("id").primaryKey(),
	coords: text("coords"),
	name: text("name"),
	created_at: text("created_at"),
});

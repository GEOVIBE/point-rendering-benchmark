<script lang="ts">
	import Point from "@arcgis/core/geometry/Point";
	import Graphic from "@arcgis/core/Graphic";
	import {mountView, createBlankGraphicsLayer} from "$lib/map";

	let viewRef: HTMLDivElement | undefined = $state();
	let isRunning = $state(false);
	let msg = $state("");

	const BUTTONS = [
		{label: "10K", count: 10_000},
		{label: "100K", count: 100_000},
		{label: "200K", count: 200_000},
		// {label: "1M", count: 1_000_000},
		// {label: "3M", count: 3_000_000},
	];

	async function runBenchmark(count = 1) {
		try {
			const result = {
				fetch: 0,
				transform: 0,
				draw: 0,
				all: 0,
			};
			const graphicsLayer = createBlankGraphicsLayer();
			const startTime = new Date().valueOf();
			const res = await fetch(`/api/points?count=${count}`);
			if (!res.ok) throw new Error("Fetch failed");
			const data = await res.json();

			const fetchTime = new Date().valueOf();
			result.fetch = Math.round(fetchTime - startTime) / 1000;

			const graphics = data.map((pt: any) => {
				const {lat, lon} = pt;

				return new Graphic({
					geometry: new Point({
						x: lon,
						y: lat,
						spatialReference: {wkid: 4326},
					}),
					attributes: {
						id: pt.id,
					},
				});
			});
			const transformTime = new Date().valueOf();
			result.transform = Math.round(transformTime - fetchTime) / 1000;
			graphicsLayer.addMany(graphics);
			const endTime = new Date().valueOf();
			const drawTime = Math.round(endTime - transformTime) / 1000;
			const allTime = Math.round(endTime - startTime) / 1000;
			result.draw = drawTime;
			result.all = allTime;

			// for (const graphic of graphicsLayer.graphics) {
			// 	graphic.symbol = {
			// 		type: "simple-marker",
			// 		style: "circle",
			// 		color: "#38bdf8",
			// 		size: 4,
			// 		outline: {
			// 			color: "#0ea5e9",
			// 			width: 0.5,
			// 		},
			// 	};
			// }
			// graphicsLayer.visible = true;

			return result;
		} catch (err) {
			return {err};
		}
	}

	async function runManualBenchmark(count: number) {
		isRunning = true;
		const res = await runBenchmark(count);
		if (Object.hasOwn(res, "err")) {
			msg = `[Benchmark] Error: ${res?.err}`;
		} else {
			msg = `[Benchmark] count = ${count}, time = ${res?.all}sec`;
			console.log(count, res);
		}
		isRunning = false;
	}

	async function runAutoBenchmark(count = 100_000) {
		isRunning = true;
		const results = [];
		for (let i = 0; i < 100; ++i) {
			msg = `[Benchmark] auto: ${i + 1}/100`;
			const result = await runBenchmark(count);
			results.push(result);
			console.log(i, result);
		}

		const filtered = results.filter((res) => {
			if (!Object.hasOwn(res, "err")) return res;
		});
		const reduced = filtered.reduce((acc, obj) => {
			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					acc[key] = (acc[key] || 0) + obj[key];
				}
			}

			return acc;
		}, {});
		const avg = {};
		for (const key in reduced) {
			avg[key] = Math.round((reduced[key] / filtered.length) * 1000) / 1000;
		}
		msg = `[Benchmark] ${JSON.stringify(avg)}`;
		isRunning = false;
	}

	$effect.pre(() => {
		if (viewRef) {
			mountView(viewRef);
		}
	});
</script>

<div class="grid min-h-dvh grid-rows-[3rem_1fr]">
	<div
		class="flex items-center gap-4 border-b border-blue-800 px-6 py-3 text-blue-700 shadow"
	>
		<div class="font-mono text-lg tracking-tight">Benchmark</div>
		<div class="ml-6 flex gap-2">
			{#each BUTTONS as btn}
				<button
					class="rounded border border-blue-700 bg-zinc-200 px-4 py-1 font-mono text-sm transition hover:bg-zinc-300 disabled:opacity-50"
					disabled={isRunning}
					onclick={() => runManualBenchmark(btn.count)}
				>
					{btn.label}
				</button>
			{/each}
			<button
				class="rounded border border-blue-700 bg-zinc-200 px-4 py-1 font-mono text-sm transition hover:bg-zinc-300 disabled:opacity-50"
				disabled={isRunning}
				onclick={() => runAutoBenchmark(100_000)}
			>
				100K ×100
			</button>
		</div>
		<div class="ml-auto flex items-center gap-2 font-mono text-xs">
			{#if msg}
				<span>{msg}</span>
			{/if}
		</div>
	</div>

	<!-- Map area -->
	<div bind:this={viewRef} class="h-full w-full"></div>
</div>

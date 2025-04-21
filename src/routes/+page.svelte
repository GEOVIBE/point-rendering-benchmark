<script lang="ts">
	import Point from "@arcgis/core/geometry/Point";
	import Graphic from "@arcgis/core/Graphic";
	import {mountView, graphicsLayer} from "$lib/map";

	let viewRef: HTMLDivElement | undefined = $state();
	let isRunning = $state(false);
	let result = $state("");

	const BUTTONS = [
		{label: "10K", count: 10_000},
		{label: "100K", count: 100_000},
		{label: "500K", count: 500_000},
		{label: "1M", count: 1_000_000},
		{label: "3M", count: 3_000_000},
	];

	async function runBenchmark(count: number) {
		isRunning = true;
		result = "";
		try {
			graphicsLayer.visible = false;
			graphicsLayer?.removeAll();

			const startTime = new Date().valueOf();
			const res = await fetch(`/api/points?count=${count}`);
			if (!res.ok) throw new Error("Fetch failed");
			const data = await res.json();

			const graphics = data.map((pt: any) => {
				const [lat, lon] = pt.coords.split(",").map(Number);
				return new Graphic({
					geometry: new Point({
						x: lon,
						y: lat,
						spatialReference: {wkid: 4326},
					}),
					attributes: {
						id: pt.id,
						name: pt.name,
						created_at: pt.created_at,
					},
				});
			});

			graphicsLayer.addMany(graphics);

			const endTime = new Date().valueOf();
			const dt = Math.round(endTime - startTime) / 1000;

			result = `[Benchmark] count = ${count}, time = ${dt}sec`;
		} catch (err) {
			result = `[Error] ${err}`;
		} finally {
			isRunning = false;
			for (const graphic of graphicsLayer.graphics) {
				graphic.symbol = {
					type: "simple-marker",
					style: "circle",
					color: "#38bdf8",
					size: 4,
					outline: {
						color: "#0ea5e9",
						width: 0.5,
					},
				};
			}

			graphicsLayer.visible = true;
		}
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
					onclick={() => runBenchmark(btn.count)}
				>
					{btn.label}
				</button>
			{/each}
		</div>
		<div class="ml-auto flex items-center gap-2 font-mono text-xs">
			{#if result}
				<span>{result}</span>
			{/if}
		</div>
	</div>

	<!-- Map area -->
	<div bind:this={viewRef} class="h-full w-full"></div>
</div>

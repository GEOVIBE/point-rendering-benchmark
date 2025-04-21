<script lang="ts">
	import {mountView} from "$lib/map";

	let viewRef: HTMLDivElement | undefined = $state();

	$effect.pre(() => {
		if (viewRef) {
			mountView(viewRef);
		}
	});
</script>

<div class="grid min-h-dvh overflow-hidden">
	<div bind:this={viewRef}></div>
</div>

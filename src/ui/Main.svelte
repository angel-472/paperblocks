<script>
  import { Game } from '@/game.js';
  import { onMount } from 'svelte';

  let gameCanvas;

  onMount(() => {
    const game = new Game(gameCanvas);
    game._start(); //Starts the game (async method, but we don't need to await it here)
  });
</script>

<!-- Debug -->
<div class="absolute top-2 left-2 p-2 text-sm text-gray-50 bg-gray-900/80">
  <p>PaperBlocks - An amazing Terraria-inspired game</p>
</div>
<script>
  import { Game } from '@/game.js';
  import { onMount } from 'svelte';

  onMount(() => {
    const game = new Game();
    game._start(); //Starts the game (async method, but we don't need to await it here)

    if(import.meta.env.DEV) {
      console.log(`[DEBUG] Game instance created:`);
      console.log(game); // Log the game instance for debugging
      window.game = game; // Expose the game instance for debugging in development mode
    }
  });
</script>

<svelte:head>
  <title>PaperBlocks - An amazing sandbox game</title>
  <meta name="description" content="PaperBlocks is an amazing sandbox game built with Svelte and JavaScript. Explore, build, and survive in a vibrant pixel art world!" />
  <link rel="icon" href="/assets/favicon.svg" />
</svelte:head>

<!-- Debug -->
<div class="absolute top-2 left-2 p-2 text-sm text-gray-50 bg-gray-900/80">
  <p>PaperBlocks - An amazing Terraria-inspired game</p>
</div>
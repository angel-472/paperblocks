  // Adds a custom logging method to the console for color-coded logs based on system type
  console.clog = (string, colorCode = 1) => {
    const colors = [
      '#4fc3f7', // 0 — entity
      '#81c784', // 1 — system
      '#ffb74d', // 2 — physics
      '#f06292', // 3 — render
      '#ce93d8', // 4 — input
      '#4db6ac', // 5 — world
      '#fff176', // 6 — audio
      '#ff8a65', // 7 — net
    ];
    colorCode = colors[colorCode];
    console.log(`%c${string}`, `color: ${colorCode}; font-weight: bold;`);
  };
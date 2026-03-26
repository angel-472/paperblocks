// Get it? "node.js" and node (scene graph node)? Yeah, I know, I'm hilarious.

// Node class, the most basic unit of the scene graph
// - Can have children and a parent
// - Can be extended to represent both logical and rendering entities in the game world

export class Node {
  // Private fields
  #children;
  #transform;
  #parent;
  #uuid;
  
  constructor(parent = null) {
    this.#children = [];
    this.#parent = parent;
    this.#uuid = crypto.randomUUID(); // Unique identifier for the node, useful for debugging and referencing
  }

  // Method to add a child node to this node's children array
  addChild(node) {
    this.#children.push(node);
  }
  
  // Method to remove a child node from this node's children array
  removeChild(node) {
    const index = this.#children.indexOf(node);
    if (index !== -1) {
      this.#children.splice(index, 1);
    }
  }

  getUUID() {
    return this.#uuid;
  }
}
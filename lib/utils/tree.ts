class Tree {
  private root: Node;
  private current: Node;
  /// Store the number of nodes.
  private length: number;
  
  constructor() {
    this.root = new Node(NodeType.Root);
    this.current = this.root;
    this.length = 1;
  }

  isEmpty() {
    return this.length === 0;
  }

  /**
   * Breadth-first visit from root node.
   */
  visit(handler: (node: Node) => void) {
    this.visitFrom(this.root, handler);
  }

  /**
   * Update current node.
   */
  update(node: Node) {
    this.current = node;
  }

  /**
   * Breadth-first visit from node.
   */
  visitFrom(node: Node, handler:(node: Node) => void) {
    let queue = Array<Node>();
    queue.push(node);

    while (queue.length !== 0) {
      const visitNode = queue.shift()!;
      queue = queue.concat(visitNode.children);
      handler(visitNode);
    }
  }

  /**
   * Add node as child of current node.
   */
  addChild(node: Node, update = true) {
    this.current.addChild(node);
    if (update) {
      this.current = node;
    }
    this.length++;
  }

  /**
   * Add node as sibling of current node.
   */
  addSibling(node: Node, update = true) {
    this.current.addChild(node);
    if (update) {
      this.current = node;
    }
    this.length++;
  }
}

enum NodeType {
  Root,
  Normal,
}

class Node {
  nodeType: NodeType;
  parent?: Node = undefined;
  children = Array<Node>();
  /// unique id
  index?: number;

  constructor(type = NodeType.Normal) {
    this.nodeType = type;
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get isRoot() {
    return this.nodeType === NodeType.Root;
  }

  addChild(node: Node) {
    node.parent = this;
    this.children.push(node);
  }
}

export { Node, Tree };

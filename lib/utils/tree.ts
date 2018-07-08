class Tree {
  root: Node;
  current: Node;
  
  constructor() {
    this.root = new Node(NodeType.Root);
    this.current = this.root;
  }

  /// Breath first searching.
  next() {
    const node = this.current.next();
    if (!node) {
      return this.current = this.current.children[this.current.childIndex];
    }
    return node;
  }

  add(node: Node) {
    this.current.add(node);
  }

  validate() {
    this.validateNode(this.root);
  }

  private validateNode(node: Node) {
    node.children.forEach(child => {
      switch (child.type) {
        case NodeType.Parent:
          if (child.children.length === 0) {
            throw Error('Parent type node but have no child');
          }
          child.children.forEach(child => {
            this.validateNode(child);
          });
          break;
        case NodeType.Leaf:
          if (child.children.length !== 0) {
            throw Error('Leaf type node but have child');
          }
          break;
      }
    });
    
    /// Root node will be validated finally.
    if (node.isRoot) {
      console.log('Passing validation.');
    }
  }
}

enum NodeType {
  Root,
  Parent,
  Leaf,
}

class Node {
  type: NodeType;
  parent?: Node = undefined;
  children = Array<Node>();
  childIndex = 0;

  constructor(type: NodeType) {
    this.type = type;
  }

  get isRoot() {
    return this.type === NodeType.Root;
  }

  next() {
    if (this.childIndex > this.children.length - 1) {
      return undefined;
    }
    return this.children[this.childIndex++];
  }

  add(node: Node) {
    node.parent = this;
    this.children.push(node);
  }
}

export { Node, Tree };

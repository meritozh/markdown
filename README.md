A markdown parser written in pure TypeScript, inspired by markdown-it heavily.

Not 100% compatible with commonmark spec, because I do not need some features.

Also add many other features because I need :)

Want a easy maintain markdown parser so I create this. Designed for my very personal blog.

I won't handle some corner case, because I won't write such markdown.

### TODO

1. All line number should start from 1, add a placeholder for index 0.
2. Make [pos => row:column:] map.
3. Core rename to State, record current processing state.
4. Remove `core.expandIndent - core.indentBlock >= 4` from all rules. If we handle code block first, why we need this?
5. Devide rules to several pieces.

```
<initial> -> code_block -> <block> -> table -> quote -> <block>
<block> -> horizontal break -> fence -> heading -> paragraph -> <inline>
<inline> -> bold -> italic -> delimiter -> image -> reference -> subscript -> superscript -> <end>
```

### Note

1. All `pos` in rule, must plus `state.blockIndent` while initializing.
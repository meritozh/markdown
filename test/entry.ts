import { ParserAction } from "../lib/parser";
import fs from "fs";
import { CodeGenerator } from "../lib/renderer/generator";

const p = new ParserAction();
const data = fs.readFileSync("/Users/gaoge/Development/markdown/test/test1.md");
p.initialize(data.toString()).tokenize();

const g = new CodeGenerator();
const r = g.initailize(p.manager.AST).generate();

fs.writeFile(
  "/Users/gaoge/Development/markdown/test/result.html",
  r,
  exception => {
    console.log(exception);
  }
);

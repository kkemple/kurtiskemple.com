import { visit } from "unist-util-visit";
import type { Root } from "hast";
import type { Element } from "hast";

export function rehypeTableWrapper() {
	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			if (node.tagName === "table") {
				// Create wrapper div with overflow classes
				const wrapper: Element = {
					type: "element",
					tagName: "div",
					properties: {
						class: "overflow-x-auto overflow-y-clip",
					},
					children: [node],
				};

				// Replace the table with the wrapper
				Object.assign(node, wrapper);
			}
		});
	};
}

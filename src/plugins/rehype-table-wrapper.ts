import { visit } from "unist-util-visit";

export function rehypeTableWrapper() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "table") {
				// Create wrapper div with overflow classes
				const wrapper = {
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

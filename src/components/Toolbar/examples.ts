import exampleList from "../../../examples.json";

async function getExamples() {
    const examples = await Promise.all(
        exampleList.order.map(async (example) => {
            try {
                const exampleContent = await import(
                    `../../../kaplay/examples/${example}.js?raw`
                );

                return {
                    name: example,
                    content: exampleContent.default,
                };
            } catch (e) {
                console.error(e);
            }
        }),
    );

    return examples;
}

export const examples = await getExamples();

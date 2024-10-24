import { js_beautify } from "js-beautify";
import { $editorInstance } from "../stores";

export const format = () => {
    const codeValue = $editorInstance.get()?.getValue();
    const formattedCode = js_beautify(codeValue ?? "", {
        indent_size: 4,
        indent_char: " ",
    });

    $editorInstance.get()?.setValue(formattedCode);
};

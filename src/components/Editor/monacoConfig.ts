import type { Monaco } from "@monaco-editor/react";
import kaboomGlobal from "../../../node_modules/kaboom/dist/global.d.ts?raw";
import kaboomModule from "../../../node_modules/kaboom/dist/kaboom.d.ts?raw";

const kaboomFunctionImports = `
import { PluginList, MergePlugins, KaboomOpt } from "./kaboom"
`;

const kaboomFunctionDt =
    `declare global { function kaboom<T extends PluginList<unknown> = [undefined]>(options?: KaboomOpt<T>): T extends [undefined] ? KaboomCtx : KaboomCtx & MergePlugins<T> }`;

export const configMonaco = (monaco: Monaco) => {
    // Add global kaboom types
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        kaboomFunctionImports + kaboomGlobal + kaboomFunctionDt,
        "global.d.ts",
    );

    // Add kaboom module types
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        kaboomModule,
        "kaboom.d.ts",
    );
};

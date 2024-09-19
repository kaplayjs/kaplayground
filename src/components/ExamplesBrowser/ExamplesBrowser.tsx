import { examples } from "./data/examples";
import { Example } from "./Example";
import "./ExamplesBrowser.css";

export const ExamplesBrowser = () => {
    return (
        <dialog id="examples-browser" className="modal bg-[#00000070]">
            <main className="modal-box overflow-hidden p-4 flex flex-col gap-2">
                <header>
                    <h2 className="text-3xl font-semibold">Examples</h2>
                    <p>
                        Explore examples to get started with KAPLAY. Click on an
                        example to open it in the editor.
                    </p>
                </header>
                <div className="examples-list | gap-2 px-4 overflow-auto">
                    {examples.map((example, index) => (
                        <Example example={example} key={index} />
                    ))}
                </div>
            </main>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

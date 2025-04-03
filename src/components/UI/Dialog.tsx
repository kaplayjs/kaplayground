import type { ComponentProps, FC } from "react";
import { View } from "./View";

type Props = ComponentProps<"dialog"> & {
    onSave?: () => void;
    onCloseWithoutSave?: () => void;
};

export const Dialog: FC<Props> = ({ onSave, onCloseWithoutSave, ...props }) => {
    return (
        <View className="modal" el={"dialog"} id={props.id} {...props}>
            <main className="modal-box overflow-hidden px-0 py-0">
                <section className="max-h-[400px] overflow-y-auto p-5">
                    {props.children}
                </section>

                <footer className="p-5 bg-base-200">
                    <div className="modal-action mt-0">
                        <form method="dialog">
                            <button
                                className="btn btn-primary"
                                onClick={onSave}
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </footer>
            </main>
            <form
                method="dialog"
                className="modal-backdrop"
            >
                <button
                    onClick={onCloseWithoutSave}
                >
                    Close
                </button>
            </form>
        </View>
    );
};

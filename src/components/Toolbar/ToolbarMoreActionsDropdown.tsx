import { assets } from "@kaplayjs/crew";
import { FC } from "react";
import { useEditor } from "../../hooks/useEditor";
import { ToolbarDropdown } from "./ToolbarDropdown";
import { ToolbarDropdownButton } from "./ToolbarDropdownButton";

export const ToolbarMoreActionsDropdown: FC = () => {
    const pause = useEditor((state) => state.pause);
    const stop = useEditor((state) => state.stop);

    return (
        <ToolbarDropdown
            icon={"down"}
            className="px-0.5 -ml-0.5 mr-0.5"
            tip="More Actions"
        >
            <ToolbarDropdownButton
                icon={assets.pause.outlined}
                text="Pause/Resume"
                keys={["ctrl", "p"]}
                onClick={pause}
            />

            <ToolbarDropdownButton
                icon={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAAAXNSR0IArs4c6QAAAU9JREFUeJzt3DFOwzAUgOFn1AtwA3Y2xE04JzdBbOzcoEcwkyuSvN9NJSDC/r+pSTrk/XK72RFKld7DWmv9qxc5QikF58cHo0dpKE56c5YoTRZnc2Md5eH+8Tff6TCf54/F9TrO4mKWKE0vzuXDbFEainOXfXmWKBE86yli35/t69PzD7/SMV7e37rPa621lFI2KyYrOEqUiHyWbOb0p6QdYUZaLc2emVwxwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDAMMAwwDDgaphrW+X+oz0zuWLAJsx6u23EWKsmmyWbOd13PdP24ohlmO6+66zgqGhWjzD4Jj3CoJklzk2HXjQek+LBOrcdrNOMHqd3FJPAFzLDZXs1wKCzAAAAAElFTkSuQmCC"}
                text="Stop"
                keys={["ctrl", "alt", "s"]}
                onClick={stop}
            />
        </ToolbarDropdown>
    );
};

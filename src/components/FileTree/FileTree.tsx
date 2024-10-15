import { View } from "../UI/View";
import { FileFold } from "./FileFold";

export const FileTree = () => {
    return (
        <View direction={"column"} padding={2} gap={2}>
            <FileFold
                level={1}
                title="Scenes"
                folder="scenes"
                kind="scene"
                toolbar
            />
            <FileFold
                folder="root"
                level={0}
            />
        </View>
    );
};

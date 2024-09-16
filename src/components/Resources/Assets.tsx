import { assets } from "@kaplayjs/crew";
import * as Tabs from "@radix-ui/react-tabs";
import ResourcesPanel from "./ResourcesPanel";
import ResourceTab from "./ResourceTab";

const Assets = () => {
    return (
        <Tabs.Root className="flex flex-col h-full">
            <Tabs.List className="tabs tabs-bordered bg-base-200 w-full">
                <ResourceTab label="Sprites" icon={assets.mark.outlined} />
                <ResourceTab label="Sounds" icon={assets.sounds.outlined} />
                <ResourceTab label="Fonts" icon={assets.fonts.outlined} />
            </Tabs.List>

            <ResourcesPanel
                value="Sprites"
                kind="sprite"
                accept="image/*"
            />
            <ResourcesPanel
                value="Sounds"
                kind="sound"
                visibleIcon={assets.sounds.sprite}
                accept="audio/*"
            />
            <ResourcesPanel
                value="Fonts"
                kind="font"
                visibleIcon={assets.fonts.sprite}
                accept=".ttf,.otf"
            />
        </Tabs.Root>
    );
};

export default Assets;

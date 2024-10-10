import { assets } from "@kaplayjs/crew";
import * as Tabs from "@radix-ui/react-tabs";
import AssetsPanel from "./AssetsPanel";
import AssetsTab from "./AssetsTab";

export const Assets = () => {
    return (
        <Tabs.Root className="flex flex-col h-full" defaultValue="Sprites">
            <Tabs.List className="tabs tabs-bordered bg-base-200 w-full">
                <AssetsTab label="Sprites" icon={assets.mark.outlined} />
                <AssetsTab label="Sounds" icon={assets.sounds.outlined} />
                <AssetsTab label="Fonts" icon={assets.fonts.outlined} />
            </Tabs.List>

            <AssetsPanel
                value="Sprites"
                kind="sprite"
                accept="image/*"
            />
            <AssetsPanel
                value="Sounds"
                kind="sound"
                visibleIcon={assets.sounds.sprite}
                accept="audio/*"
            />
            <AssetsPanel
                value="Fonts"
                kind="font"
                visibleIcon={assets.fonts.sprite}
                accept=".ttf,.otf"
            />
        </Tabs.Root>
    );
};

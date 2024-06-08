import { useAssets } from "@/hooks/useAssets";
import type { Asset, AssetKind } from "@/stores/project/assets";
import { fileToBase64 } from "@/util/fileToBase64";
import { removeExtension } from "@/util/removeExtensions";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import * as HUI from "@headlessui/react";
import { type FC, useEffect } from "react";
import Dropzone from "react-dropzone";
import Resource from "./Resource";
import ResourceAddButton from "./ResourceAddButton";
import ResourcesList from "./ResourcesList";

type Props = {
    kind: AssetKind;
    visibleIcon?: string;
    accept: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const ResourcesPanel: FC<Props> = (props) => {
    const { addAssetsToQueue } = useAssets({ kind: props.kind });

    const handleAssetDrop = async (acceptedFiles: File[]) => {
        addAssetsToQueue(acceptedFiles, props.kind);
    };

    return (
        <HUI.TabPanel className="w-full h-full">
            <Dropzone onDrop={handleAssetDrop} noClick>
                {({ getRootProps, getInputProps }) => (
                    <div
                        className="h-full p-2"
                        {...getRootProps()}
                    >
                        <div className="h-full flex flex-col justify-between">
                            <ResourcesList
                                kind={props.kind}
                                onDragData={props.onDragData}
                                visibleIcon={props.visibleIcon}
                            />
                            <ResourceAddButton
                                accept={props.accept}
                                kind={props.kind}
                                inputProps={getInputProps()}
                            />
                        </div>
                    </div>
                )}
            </Dropzone>
        </HUI.TabPanel>
    );
};

export default ResourcesPanel;

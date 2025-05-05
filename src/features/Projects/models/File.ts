export type RealFile = {
    kind: "file";
    path: string;
    name: string;
    language: string;
    value: string;
};

export type Folder = {
    kind: "folder";
    path: string;
    name: string;
};

export type File = RealFile | Folder;

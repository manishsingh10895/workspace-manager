export interface DirectoryInfo {
    path: string;
    command: string;
    //Path for the editor binary
    editor?: { name: string, path: string };
}
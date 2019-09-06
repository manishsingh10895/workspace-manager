import { DirectoryInfo } from "./directory-info.class";

export interface Workspace {
    pid?: number,
    name: string;
    directories: Array<DirectoryInfo>
}
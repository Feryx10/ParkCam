import { Capture } from "./capture";

export interface Camera {
    name: string,
    code: string,    
    link: string,
    data?: Capture[],
}
export enum AlertType {
    success = "succes", info = "info", error = "error"
}

export interface AlertAction {
    title: string;
    action: () => void
}


export class Alert {
    message: string;
    persist: boolean = false;
    type: AlertType = AlertType.info;
    actions: AlertAction[] = [];

    constructor(info: Partial<Alert>) {
        Object.assign(this, info);
    }
}
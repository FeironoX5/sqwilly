import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RequirementHandler {
    public static isNonEmptyString(value: string): boolean {
        return !(value == null || value.length == 0);
    }

    public static isNonEmptyArray(value: any[]): boolean {
        return !(value == null || value.length == 0);
    }
}

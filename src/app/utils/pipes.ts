import {Pipe, PipeTransform} from "@angular/core";
import {SQLField} from "./models";

@Pipe({
    standalone: true,
    name: "orderFields",
    pure: false,

})
export class OrderFields implements PipeTransform {
    transform(array: SQLField[]): SQLField[] {
        return array.sort((a: SQLField, b: SQLField) => {
            return (+b.isPrimary) - (+a.isPrimary);
        });
    }
}

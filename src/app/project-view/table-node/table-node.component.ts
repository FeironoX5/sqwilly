import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    QueryList,
    ViewChildren
} from '@angular/core';
import {CustomNodeComponent, VflowModule} from "ngx-vflow";
import {SQLField, SQLTable} from "../../utils/models";
import {FormsModule} from "@angular/forms";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {OrderFields} from "../../utils/pipes";
import {CdkTextareaAutosize, TextFieldModule} from "@angular/cdk/text-field";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip, MatTooltipModule} from "@angular/material/tooltip";
import {CommentsHandler} from "../../utils/handlers/comments-handler";
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";

@Component({
    selector: 'app-table-node',
    standalone: true,
    imports: [
        OrderFields,
        FormsModule,
        NgClass,
        NgStyle,
        VflowModule,
        MatIconModule,
        NgForOf,
        MatTooltipModule,
        MatMenuModule,
        TextFieldModule,
        NgIf
    ],
    templateUrl: './table-node.component.html',
    styleUrls: ['./table-node.component.css']
})
export class TableNodeComponent extends CustomNodeComponent<SQLTable> {
    @ViewChildren('fieldName') fieldNames: QueryList<ElementRef> | undefined;
 // todo подписка на изменение хуйни говна
    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    cellKeyPressed($event: KeyboardEvent, i: number): boolean {
        if ($event.key == "Enter") {
            if (!this.focusNextCell(i)) {
                this.addCell();
            }
            return false;
        } else if ($event.key == "Backspace" && this.node.data!.fields[i].name.length == 0) {
            this.focusPreviousCell(i);
            this.removeCell(i);
            return false;
        } else if ($event.key == "ArrowUp") {
            this.focusPreviousCell(i);
            return false;
        } else if ($event.key == "ArrowDown" || $event.key == "Tab") {
            this.focusNextCell(i);
            return false;
        } else if ($event.key == " ") {
            return false;
        }
        return true;
    }

    headerKeyPressed($event: KeyboardEvent): boolean {
        if ($event.key == "Enter") {
            return false;
        } else if ($event.key == " ") {
            return false;
        }
        return true;
    }

    focusNextCell(i: number): boolean {
        if (i >= this.node.data!.fields.length - 1) return false;
        this.fieldNames?.get(i + 1)!.nativeElement.focus();
        return true;
    }

    focusPreviousCell(i: number): boolean {
        if (i < 1) return false;
        this.fieldNames?.get(i - 1)!.nativeElement.focus();
        return true;
    }

    addCell() {
        this.node.data!.fields.push({name: '', isPrimary: false, references: null});
        this.changeDetectorRef.detectChanges();
        this.fieldNames?.last.nativeElement.focus();
    }

    removeCell(i: number) {
        this.node.data!.fields.splice(i, 1);
    }

    isTableValid(): string {
        return CommentsHandler.generate([
            {message: 'Table name is too short', isValid: this.node.data!.name.length == 0},
            {message: 'Table has no fields', isValid: this.node.data!.fields.length == 0},
        ]);
    }

    isFieldValid(i: number): string {
        const field: SQLField = this.node.data!.fields[i];
        return CommentsHandler.generate([
            {message: 'Field name is too short', isValid: field.name.length == 0},
        ]);
    }
}


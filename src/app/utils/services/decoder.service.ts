import {Injectable} from "@angular/core";
import {Node} from "ngx-vflow";
import {TableNodeComponent} from "../../project-view/table-node/table-node.component";

@Injectable({
    providedIn: 'root'
})
export class DecoderService {
    decode(unparsedValue: string): Node[] {
        const unparsedTables: string[] = [
            ...unparsedValue.matchAll(/( *\w+: *\n( *(PK *)?\w+( *> *\w+\.\w+)? *\n)+)/g)
        ].map(match => match[0]);
        const objectTables = unparsedTables.map(unparsedTable => {
            const rows = unparsedTable.split('\n')
                .map(row => row.replaceAll(/,| /g, ''));
            const title = rows[0].substring(0, rows[0].length - 1);
            const fields = rows.slice(1, rows.length)
                .filter(field => field.length > 0)
                .map(field => {
                    const isPrimary = field.slice(0, 2) == 'PK';
                    const data = (isPrimary ? field.slice(2, field.length) : field).split('>');
                    const name = data[0];
                    const references = data.length > 1 ? data[1].split('.') : null;
                    return {
                        isPrimary: isPrimary,
                        name: name,
                        references: references ? {
                            tableName: references ? references[0] : null,
                            fieldName: references ? references[1] : null
                        } : null,
                    }
                });
            return {
                title: title,
                fields: fields
            }
        });
        let nodes: Node[] = objectTables.map(objectTable => {
            return {
                id: crypto.randomUUID(),
                point: {x: 0, y: 0},
                type: TableNodeComponent,
                data: {
                    name: objectTable.title,
                    fields: objectTable.fields
                }
            }
        });
        return nodes;
    }

}
export interface SQLTable {
    name: string,
    fields: SQLField[]
}

export interface SQLField {
    name: string,
    isPrimary: boolean
}

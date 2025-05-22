// child.types.ts (corregido a camelCase)
export interface Child {
    id?: number;
    fatherId: number;
    name: string;
    lastName: string;
    gender: 'M' | 'F';
    birthDate: string;
    morningBrushingTime: string;
    afternoonBrushingTime: string;
    nightBrushingTime: string;
    creationDate?: string
    lastModificationDate?: string;
    isActive?: boolean;
}

export type CreateChildInput = Omit<Child, 'id' | 'creationDate' | 'lastModificationDate' | 'isActive'>;
export type UpdateChildInput = Partial<Omit<Child, 'id' | 'creationDate' | 'lastModificationDate' | 'isActive'>>;
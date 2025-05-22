// child.types.ts (corregido a camelCase)
export interface Child {
    id?: number;
    fatherId: number; // ✅ (no father_id)
    name: string;
    lastName: string; // ✅ (no last_name)
    gender: 'M' | 'F';
    birthDate: string; // ✅ (no birth_date)
    morningBrushingTime: string; // ✅ (no morning_brushing_time)
    afternoonBrushingTime: string;
    nightBrushingTime: string;
    creationDate?: string; // ✅
    lastModificationDate?: string; // ✅ (no last_modification_date)
    isActive?: boolean; // ✅ (no is_active)
}

export type CreateChildInput = Omit<Child, 'id' | 'creationDate' | 'lastModificationDate' | 'isActive'>;
export type UpdateChildInput = Partial<Omit<Child, 'id' | 'creationDate' | 'lastModificationDate' | 'isActive'>>;
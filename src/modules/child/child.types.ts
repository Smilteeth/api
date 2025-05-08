export interface Child {
    id?: number;
    father_id: number;
    name: string;
    last_name: string;
    gender: 'M' | 'F';
    birth_date: string;
    morning_brushing_time: string;
    afternoon_brushing_time: string;
    night_brushing_time: string;
    creation_date?: string;
    last_modification_date?: string;
    is_active?: boolean;
  }

export type CreateChildInput = Omit<Child, 'id' | 'creation_date' | 'last_modification_date' | 'is_active'>;
export type UpdateChildInput = Partial<Omit<Child, 'id' | 'creation_date' | 'last_modification_date' | 'is_active'>>;
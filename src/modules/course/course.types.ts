import { dbTypes } from "../../config/db/types";

export type CourseTableTypes = Omit<dbTypes['CourseTable'], "lastModificationDate">;

export type LessonType = {
  name: string;
  contentUrl: string;
}

export type CourseReturnType = CourseTableTypes & { lessons: Array<LessonType> | undefined } 

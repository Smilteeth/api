import { DrizzleD1Database } from "drizzle-orm/d1";
import { DataAccessObject } from "../../types/daos.interface";
import { CourseReturnType, CourseTableTypes, LessonType } from "./course.types";

import { courseTable, lessonTable } from '../../config/db/schema';

import * as schema from '../../config/db/schema';
import { eq, getTableColumns } from "drizzle-orm";

export class CourseDao implements DataAccessObject<CourseTableTypes | CourseReturnType | LessonType> {

  private db: DrizzleD1Database<typeof schema>;

  constructor(db: DrizzleD1Database<typeof schema>) {
    this.db = db;
  }

  async create() {
    return;
  }

  async fetchCourses(): Promise<Array<CourseTableTypes> | undefined> {
    return await this.db.query.courseTable.findMany({
      orderBy: (model, { desc }) => desc(model.creationDate),
      columns: {
        lastModificationDate: false
      }
    });
  }

  async fetchById(id: number): Promise<CourseReturnType | undefined> {

    const allCourseTables = getTableColumns(courseTable);

    const {
      lastModificationDate,
      ...returnedCourseData
    } = allCourseTables;

    const courses = await this.db.select({
      ...returnedCourseData,
    })
      .from(courseTable).innerJoin(lessonTable, eq(lessonTable.courseId, id))
      .where(eq(courseTable.courseId, id))
      .limit(1);

    const course = courses[0];

    const lessons = await this.fetchLessons(course.courseId);

    return {
      ...course,
      lessons: lessons
    };
  };

  async fetchLessons(id: number): Promise<Array<LessonType> | undefined> {
    return await this.db.query.lessonTable.findMany({
      where: (model, { eq }) => eq(model.courseId, id),
      orderBy: (model, { asc }) => asc(model.lessonId)
    })
  }

  async fetchLesson(id: number): Promise<LessonType | undefined> {
    return await this.db.query.lessonTable.findFirst({
      where: (model, { eq }) => eq(model.lessonId, id),
      columns: {
        name: true,
        contentUrl: true
      }
    });
  }
}

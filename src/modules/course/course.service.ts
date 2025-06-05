import { HTTPException } from "hono/http-exception";
import { JwtPayload } from "../../types/payload.type";
import { CourseDao } from "./course.dao";
import { Pagination, PaginationType } from "../../utils/pagination";
import { CourseTableTypes } from "./course.types";
import { lessonTable } from "../../config/db/schema";

export class CourseService {
  private courseDao: CourseDao;
  private jwtPayload: JwtPayload;
  private pagination: Pagination;

  constructor(courseDao: CourseDao, jwtPayload: JwtPayload) {
    this.courseDao = courseDao;
    this.jwtPayload = jwtPayload;
    this.pagination = new Pagination();
  }

  async fetchCourses(page: number, limit: number): Promise<PaginationType<CourseTableTypes>> {
    const courses = await this.courseDao.fetchCourses();

    if (!courses) {
      throw new HTTPException(404, { message: "No courses found" });
    }

    return this.pagination.generate<CourseTableTypes>(courses, page, limit);
  }

  async fetchCourseById(id: number) {
    const course = await this.courseDao.fetchById(id);

    if (!course) {
      throw new HTTPException(404, { message: "No course found" });
    }

    return course;
  }

  async fetchLessonById(id: number) {
    const lesson = await this.courseDao.fetchLesson(id);

    if (!lesson) {
      throw new HTTPException(404, { message: "No course found" });
    }

    return lesson;
  }

}

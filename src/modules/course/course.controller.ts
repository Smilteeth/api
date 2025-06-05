import { Context } from "hono";
import { CourseService } from "./course.service";
import { Pagination } from "../../utils/pagination";
import { ServiceFactory } from "../../core/service.factory";
import { HTTPException } from "hono/http-exception";
import { parse } from "dotenv";

export class CourseController {
  private courseService: CourseService;
  private pagination: Pagination;

  constructor(c: Context) {
    this.courseService = new ServiceFactory(c).createService('course');
    this.pagination = new Pagination();
  }

  async fetchCourses(c: Context) {
    const { page, limit } = c.req.query();

    const { parsedPage, parsedLimit } = this.pagination.getPaginationValues(page, limit);

    return c.json(await this.courseService.fetchCourses(parsedPage, parsedLimit));
  }

  async fetchCourse(c: Context) {
    const id = c.req.param('id');

    const parsedId = this.getId(id);

    return c.json(await this.courseService.fetchCourseById(parsedId));
  }

  async fetchLesson(c: Context) {
    const id = c.req.param('id');

    const parsedId = this.getId(id);

    return c.json(await this.courseService.fetchLessonById(parsedId));
  }

  private getId(id: string) {
    if (!id) {
      throw new HTTPException(401, { message: 'Missing appointment id' });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new HTTPException(401, { message: 'Invalid appointment id' });
    }

    return parsedId;
  }
}

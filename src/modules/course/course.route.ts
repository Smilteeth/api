import { Hono } from "hono";
import { CourseController } from "./course.controller";

type Variables = {
  courseController: CourseController;
};

const courseRouter = new Hono<{ Variables: Variables }>();

courseRouter.use('*', async (c, next) => {
  if (!c.var.courseController) {
    c.set('courseController', new CourseController(c));
  }
  await next();
});

courseRouter.get('/lesson/:id', (c) => c.var.courseController.fetchLesson(c));

courseRouter.get('/', (c) => c.var.courseController.fetchCourses(c));

courseRouter.get('/:id', (c) => c.var.courseController.fetchCourse(c));

export default courseRouter;

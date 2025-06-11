import { Hono } from "hono/tiny";
import { TransactionController } from "./transaction.controller"

type Variables = {
  transactionController: TransactionController;
}

const transactionRouter = new Hono<{ Variables: Variables }>();

transactionRouter.use('*', async (c, next) => {
  if (!c.var.transactionController) {
    c.set('transactionController', new TransactionController(c));
  }
  await next();
});

transactionRouter.put('/', (c) => c.var.transactionController.create(c));
transactionRouter.get('/:id', (c) => c.var.transactionController.fetchById(c));

export default transactionRouter;

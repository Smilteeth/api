import { Context } from "hono";
import { ServiceFactory } from "../../core/service.factory";
import { ChildService } from "../child/child.service";
import { TransactionService } from "./transaction.service";
import { TransactionTable } from "./transaction.types";
import { HTTPException } from "hono/http-exception";

export class TransactionController {
  private transactionService: TransactionService;
  private childService: ChildService;

  constructor(c: Context) {
    this.transactionService = new ServiceFactory(c).createService('transaction');
    this.childService = new ServiceFactory(c).createService('child');
  }

  async create(c: Context) {
    const data: Omit<TransactionTable, "transaction_id" | "creation_date"> = await c.req.json();

    if (!this.isValidData(data)) {
      throw new HTTPException(400, { message: 'Missing attribute' });
    }

    await this.childService.fetchById(data.childId!);

    await this.transactionService.create(data);

    return c.json({ message: `Added ${data.ammount} coins` }, 201);
  }

  private isValidData(data: Partial<TransactionTable>) {
    const requiredFields: Array<keyof TransactionTable> = [
      'ammount',
      'childId'
    ];

    return requiredFields.every((field) => Boolean(data[field]));
  }

  async fetchById(c: Context) {

    const id = c.req.param('id');

    const parsedId = this.getId(id);

    return c.json(await this.transactionService.fetchById(parsedId));

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

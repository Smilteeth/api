import { HTTPException } from "hono/http-exception";
import { TransactionDao } from "./transaction.dao";
import { TransactionTable } from "./transaction.types";

export class TransactionService {
  private transactionDao: TransactionDao;

  constructor(transactionDao: TransactionDao) {
    this.transactionDao = transactionDao;
  }

  async create(data: Omit<TransactionTable, "transaction_id" | "creation_date">) {
    await this.transactionDao.create(data);
  }

  async fetchById(id: number) {
    const transactions = await this.transactionDao.fetchById(id);

    if (!transactions) {
      throw new HTTPException(404, { message: 'Transactions not found' });

    }

    const total = 0;

    return transactions.reduce(
      (accumulator, transaction) => accumulator + transaction.ammount,
      total,
    );
  }
}

import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { HTTPResponseError } from 'hono/types';
import { d1Errors } from '../utils/d1Errors';

export function handleError(err: Error | HTTPResponseError, c: Context) {
  console.log(err);
  if (err.message.includes('D1_ERROR')) {
    const error = d1Errors[err.message.split(' ')[1]];

    if (error) {
      return c.text(error.message, error.code);
    }

    return c.text('There was a data integrity issue with your request. Please check your input and try again.', 400);
  }

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.text('An unexpected server error occurred. Please try again later.', 500);
}

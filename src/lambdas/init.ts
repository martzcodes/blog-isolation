import { write } from '../repository/write';

export const handler = async () => {
  const writeRes = await write();
  console.log(writeRes);
  return {
    statusCode: 200,
    body: 'OK',
  };
};
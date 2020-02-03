import { Request } from 'express';
export const CookieExtracter = (req: Request) => {
  const token = req.cookies.Authorization || '';
  return token;
};

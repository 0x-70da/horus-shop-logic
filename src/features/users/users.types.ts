import type { Request } from "express";

interface UserRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
};

export type { UserRequest };

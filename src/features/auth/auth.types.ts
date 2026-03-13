interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export type { RegisterBody, LoginBody };

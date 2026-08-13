import { GraphQLError } from "graphql/error";
import { Context } from "../middleware/context";

export const isAuth = (ctx: Context) => {
  if (!ctx.userId) {
    throw new GraphQLError("Not authenticated — please log in first", {
      extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
    });
  }
};

export const isAdmin = (ctx: Context) => {
  if (ctx.role !== "ADMIN") {
    throw new GraphQLError("Not authenticated, only admin can", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }
};

export const checkFirstName = (name: string) => {
  name = name.trim();

  if (!name) {
    throw new GraphQLError("First name is required", {
      extensions: {
        code: "BAD_INPUT",
        field: "firstname",
      },
    });
  }

  if (name.length < 2) {
    throw new GraphQLError(
      "First name must be at least two characters long",
      {
        extensions: {
          code: "BAD_INPUT",
          field: "firstname",
        },
      },
    );
  }

  if (name.length > 30) {
    throw new GraphQLError("First name cannot exceed 30 characters", {
      extensions: {
        code: "BAD_INPUT",
        field: "firstname",
      },
    });
  }

  const pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

  if (!pattern.test(name)) {
    throw new GraphQLError(
      "First name can only contain letters, spaces and hyphens (-) only",
      {
        extensions: {
          code: "BAD_INPUT",
          field: "firstname",
        },
      },
    );
  }

  return name;
};

export const checkLastName = (name: string) => {
  name = name.trim();

  if (!name) {
    throw new GraphQLError("Last name is required", {
      extensions: {
        code: "BAD_INPUT",
        field: "lastname",
      },
    });
  }

  if (name.length < 2) {
    throw new GraphQLError(
      "Last name must be at least two characters long",
      {
        extensions: {
          code: "BAD_INPUT",
          field: "lastname",
        },
      },
    );
  }

  if (name.length > 30) {
    throw new GraphQLError("Last name cannot exceed 30 characters.", {
      extensions: {
        code: "BAD_INPUT",
        field: "lastname",
      },
    });
  }

  const pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

  if (!pattern.test(name)) {
    throw new GraphQLError(
      "Last name can only contain letters, spaces and hyphens (-) only",
      {
        extensions: {
          code: "BAD_INPUT",
          field: "lastname",
        },
      },
    );
  }

  return name;
};

export const checkemail = (email: string): string => {
  email = email.trim();
  const emailRegex =  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!email.trim()) {
    throw new GraphQLError("Email is required", {
      extensions: {
        code: "Bad Input",
        field: "email",
      },
    });
  }

  if (!emailRegex.test(email.trim())) {
    throw new GraphQLError("Enter a valid email address", {
      extensions: {
        code: "Bad Input",
        field: "email",
      },
    });
  }

  return email.trim().toLowerCase();
};

export const checkPassword = (password: string): string => {
  password = password.trim();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!password.trim()) {
    throw new GraphQLError("Password is required", {
      extensions: {
        code: "Bad Input",
        field: "password",
      },
    });
  }
  if (!passwordRegex.test(password)) {
    throw new GraphQLError(
      "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.",
      {
        extensions: {
          code: "Bad Input",
          field: "password",
        },
      },
    );
  }

  return password.trim();
};

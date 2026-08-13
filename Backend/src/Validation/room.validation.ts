import { GraphQLError } from "graphql/error";

export const checkName = (name: string) => {
  name = name.trim();
  if (!name) {
    throw new GraphQLError("name is required", {
      extensions: {
        code: "BAD_INPUT",
        field: "name",
      },
    });
  }
  if (name.length < 2) {
    throw new GraphQLError("name must be at least 2 characters", {
      extensions: {
        code: "BAD_INPUT",
        field: "name",
      },
    });
  }
  if (name.length > 50) {
    throw new GraphQLError("name cannot exceed 50 characters", {
      extensions: {
        code: "BAD_INPUT",
        field: "name",
      },
    });
  }
  const pattern = /^[A-Za-z0-9][A-Za-z0-9 _-]*$/;
  if (!pattern.test(name)) {
    throw new GraphQLError(
      "name can only contain letters, numbers, spaces, hyphens and underscores",
      {
        extensions: {
          code: "BAD_INPUT",
          field: "name",
        },
      },
    );
  }
  return name;
};
export const checkCapacity = (capacity: number) => {
  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw new GraphQLError("Capacity must be a positive whole number", {
      extensions: {
        code: "BAD_INPUT",
        field: "capacity",
      },
    });
  }
  if (capacity > 1000) {
    throw new GraphQLError("Capacity cannot exceed 1000", {
      extensions: {
        code: "BAD_INPUT",
        field: "capacity",
      },
    });
  }
  return capacity;
};
export const checkFloor = (floor: number) => {
  if (!Number.isInteger(floor)) {
    throw new GraphQLError("Floor must be a whole number", {
      extensions: {
        code: "BAD_INPUT",
        field: "floor",
      },
    });
  }

  if (floor < 0) {
    throw new GraphQLError("Floor cannot be negative", {
      extensions: {
        code: "BAD_INPUT",
        field: "floor",
      },
    });
  }

  return floor;
};

export const checkLocation = (location: string) => {
  location = location.trim();

  if (!location) {
    throw new GraphQLError("Location is required", {
      extensions: {
        code: "BAD_INPUT",
        field: "location",
      },
    });
  }

  if (location.length > 100) {
    throw new GraphQLError("Location cannot exceed 100 characters", {
      extensions: {
        code: "BAD_INPUT",
        field: "location",
      },
    });
  }

  return location;
};

import { Field, ID, ObjectType } from "type-graphql";
import { Role } from "./enums.type.js";

@ObjectType("User")
export class UserType {
  @Field(() => ID)
  id: number;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
import { Mutation, Resolver } from "type-graphql";
import { AuthPayloadType } from "../Types/payload.type.js";

@Resolver()
export class AuthResolver{
    @Mutation(()=>AuthPayloadType)
    async SignUp(){
        
    }
}
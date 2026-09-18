import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../../middleware/context.js";
import { UsageDataType } from "../Types/analytics.type.js";
import { usedAnalytics } from "../services/analytics.service.js";

@Resolver()
export class AnalyticsResolver {
  @Query(() => UsageDataType)
  async UsedAnalytics(
    @Arg("startDate", () => String) startDate: string,
    @Arg("endDate", () => String) endDate: string,
    @Ctx() ctx: Context,
  ) {
    return usedAnalytics(ctx, { startDate, endDate });
  }
}
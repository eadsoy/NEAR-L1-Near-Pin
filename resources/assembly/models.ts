import { AccountId, Money, Timestamp } from "../utils";
import { Context, u128, PersistentSet, PersistentVector, PersistentMap } from "near-sdk-core"

@nearBindgen
export class Resource {
  resourceId: i32;
  creator: AccountId = Context.sender;
  created_at: Timestamp = Context.blockTimestamp;
  vote_score: i32 = 0;
  total_donations: u128 = u128.Zero;
  votes: Set<string> = new Set<string>();
  bookmarks: Set<string> = new Set<string>();

  constructor(
    public title: string,
    public url: string,
    public category: Array<string>
  ) {}
}
@nearBindgen
export class Donation {
  amount: Money = Context.attachedDeposit;
  donor: AccountId = Context.predecessor;
  created_at: Timestamp = Context.blockTimestamp;
}

export const resources = new PersistentVector<Resource>("r")
export const donations = new PersistentVector<Donation>("d");
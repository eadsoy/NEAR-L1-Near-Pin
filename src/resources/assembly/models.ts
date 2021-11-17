import { RESOURCE_KEY, AccountId, Money, Timestamp } from "../../utils";

import { storage, Context, u128, PersistentSet, PersistentVector, PersistentMap } from "near-sdk-core"


// TODO: MOVE TO UTILS
export enum Category {
  "NEAR Docs",
  "Smart Contracts",
  "NEAR",
  "Learn NEAR"
}


// -------------------------------
// -------------------------------
@nearBindgen
export class Vote {
  created_at: Timestamp = Context.blockTimestamp;

  constructor(
    public value: i8,
    public voter: AccountId
  ) { }
}


@nearBindgen
export class Resource {
  creator: AccountId = Context.sender;
  created_at: Timestamp = Context.blockTimestamp;
  vote_score: i32 = 0;
  total_donations: u128 = u128.Zero;

  constructor(
    public title: string,
    public url: string,
    public category: Category
  ) {}

  static get(): Resource {
    return storage.getSome<Resource>(RESOURCE_KEY)
  }

  static set(resource: Resource): void {
    storage.set(RESOURCE_KEY, resource)
  }
}

//const comments = new PersistentVector<Comment>("c");
export const votes = new PersistentVector<Vote>("v");
export const voters = new PersistentSet<AccountId>("vs");
//export const donations = new PersistentVector<Donation>("d");
//export const resources = new PersistentMap<AccountId, Resource>("r")
export const resources = new PersistentVector<Resource>("r")
//export const contributors = new PersistentSet<AccountId>("c")
export const creators = new PersistentSet<AccountId>("c")
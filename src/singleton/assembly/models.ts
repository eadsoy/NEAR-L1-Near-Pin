import { RESOURCE_KEY, AccountId, Money, Timestamp } from "../../utils";

import { storage, Context, u128, PersistentSet, PersistentVector, PersistentMap } from "near-sdk-core"


// TODO: MOVE TO UTILS
export enum Category {
  'yes',
  'no',
  'NEAR'
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


  /**
   * 
   * @returns 
   */

  static get(): Resource {
    return storage.getSome<Resource>(RESOURCE_KEY)
  }

  static set(resource: Resource): void {
    storage.set(RESOURCE_KEY, resource)
  }

  // ----------------------------------------------------------------------------
  // Voting
  // ----------------------------------------------------------------------------
  /**
   * 
   * @param voter 
   * @param value 
   */
  static add_vote(voter: string, value: i8): void {
    // allow each account to vote only once
    assert(!voters.has(voter), "Voter has already voted")
    // fetch meme from storage
    const meme = this.get()
    // calculate the new score for the meme
    meme.vote_score = meme.vote_score + value
    // save it back to storage
    this.set(meme)
    // remember the voter has voted
    voters.add(voter)
    // add the new Vote
    votes.push(new Vote(value, voter))
  }

  static get_votes_count(): u32 {
    return votes.length
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
import { Context, logging, u128} from "near-sdk-core"
import { Resource, Vote, Donation, resources, creators, votes, voters, donations} from "./models"
import { AccountId, PAGE_SIZE } from "../../utils"

// ____________________________________________________
// ___________________ add resource ___________________
// ____________________________________________________
/**
 * 
 * @param accountId 
 * @param title 
 * @param url 
 * @param category 
 */
export function addResource(accountId: AccountId, title: string, url: string, category: string): void {
  // url has to have identifier from valid content provider
  assert(isValidURL(url), "URL is not valid, must start with valid https://")

  // save the resource to storage
  const resource = new Resource(title, url, category)

  resources.push(resource)
  creators.add(accountId)
}

// ___________________________________________________
// __________________ get resources __________________
// ___________________________________________________
/**
 * 
 * @returns resources
 */
export function getResources(): Resource[] {
  const numResources = min(PAGE_SIZE, resources.length);
  const startIndex = resources.length - numResources;
  const result = new Array<Resource>(numResources);
  for(let i = 0; i < numResources; i++) {
    result[i] = resources[i + startIndex];
  }
  return result;
}

// ____________________________________________________
// ______________ add vote to a resource ______________
// ____________________________________________________
/**
 * 
 * @param voter 
 * @param value 
 * @param resourceId 
 */
export function addVote(voter: string, value: i8, resourceId: i32 ): void {
  // TODO: Voter shouldn't be able to upvote more than once
  //assert(!voters.has(voter) && , "Voter has already voted")
 
  assert(resourceId >= 0, 'resourceId must be bigger than 0');
	assert(resourceId < resources.length, 'resourceId must be valid');

  const resource = resources[resourceId];
  logging.log("resource is: ")
  logging.log(resource)
  // calculate the new score for the meme
  resource.vote_score = resource.vote_score + value
  // save it back to storage
  resources.replace(resourceId, resource);
  // remember the voter has voted
  voters.add(voter)
  // add the new Vote
  votes.push(new Vote(value, voter, resourceId))
}

// __________________________________________________________
// ______________ get vote count of a resource ______________
// __________________________________________________________
/**
 * 
 * @param resourceId 
 * @returns vote_score of resource
 */
export function getVotesCount(resourceId: i32): u32 {
  const resource = resources[resourceId];

  return resource.vote_score
}

// ________________________________________________________
// ______________ add donation to a resource ______________
// ________________________________________________________
/**
 * 
 * @param resourceId 
 */
export function addDonation(resourceId: i32): void {
  assert(resourceId >= 0, 'resourceId must be bigger than 0');
	assert(resourceId < resources.length, 'resourceId must be valid');

  const resource = resources[resourceId];

  // record the donation
  resource.total_donations = u128.add(resource.total_donations, Context.attachedDeposit);

  // save it back to storage
  resources.replace(resourceId, resource);
  // add the new Donation
  donations.push(new Donation())
}

// ______________________________________________________________
// ______________ get donation count of a resource ______________
// ______________________________________________________________
/**
 * 
 * @param resourceId 
 * @returns total_donations
 */
export function getDonationsCount(resourceId: i32): u128 {
  const resource = resources[resourceId];
  return resource.total_donations
}

// __________________________________________
// ______________ validate url ______________
// __________________________________________
/**
 * 
 * @param url 
 * @returns 
 */
function isValidURL(url: string): bool {
  return url.startsWith("https://")
}
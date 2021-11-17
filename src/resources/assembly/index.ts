import { storage, Context, logging, u128, PersistentVector} from "near-sdk-core"
import { Resource, Vote, Donation, resources, creators, votes, voters, donations} from "./models"
import { AccountId, PAGE_SIZE } from "../../utils"


export function addResource(accountId: AccountId, title: string, url: string, category: string): void {
  // url has to have identifier from valid content provider
  assert(is_valid_url(url), "URL is not valid, must start with valid https://")

  // save the resource to storage
  const resource = new Resource(title, url, category)

  resources.push(resource)
  creators.add(accountId)
}

export function getResources(): Resource[] {
  const numResources = min(PAGE_SIZE, resources.length);
  const startIndex = resources.length - numResources;
  const result = new Array<Resource>(numResources);
  for(let i = 0; i < numResources; i++) {
    result[i] = resources[i + startIndex];
  }
  return result;
}

function is_valid_url(url: string): bool {
  return url.startsWith("https://")
}

export function addVote(voter: string, value: i8, resourceId: i32 ): void {
  // TODO: Voter shouldn't be able to upvote more than once
  //assert(!voters.has(voter) && , "Voter has already voted")
 
  assert(resourceId >= 0, 'resourceID must be bigger than 0');
	assert(resourceId < resources.length, 'resourceID must be valid');

  const resourceToVote = resources[resourceId];
  logging.log("resourceToVote is: ")
  logging.log(resourceToVote)
  // calculate the new score for the meme
  resourceToVote.vote_score = resourceToVote.vote_score + value
  
  // save it back to storage
  resources.replace(resourceId, resourceToVote);
  // remember the voter has voted
  voters.add(voter)
  // add the new Vote
  votes.push(new Vote(value, voter, resourceId))
}

export function getVotesCount(): u32 {
  return votes.length
}

// TODO:
export function addDonation(resourceId: i32): void {
  // fetch meme from storage
  const resourceToDonate = resources[resourceId];

  // record the donation
  resourceToDonate.total_donations = u128.add(resourceToDonate.total_donations, Context.attachedDeposit);

  // save it back to storage
  resources.replace(resourceId, resourceToDonate);
  // add the new Donation
  donations.push(new Donation())
}

export function get_donations_count(): u32 {
  return donations.length
}



//NOTE: resources is stored in PersistentMap
// export function addResource(accountId: AccountId, title: string, url: string, category: Category): void {
//   // url has to have identifier from valid content provider
//   assert(is_valid_url(url), "URL is not valid, must start with valid https://")

//   // save the resource to storage
//   const resource = new Resource(title, url, category)

//   resources.set(accountId, resource)
//   //resources.push(resource)
//   creators.add(accountId)
// }


// export function removeResource() : void {
//   assert(resources.contains(Context.sender), "You didn't add any resources.");

//   resources.delete(Context.sender);
//   creators.delete(Context.sender);

//   logging.log(`\n\n\t> Resource removed. \n\n\t`)
// } 


// export function viewMyResources(accountId: string) : Resource | null{
//   if (resources.contains(accountId)) {
//       let resource = resources.getSome(accountId);
//       logging.log(`\n\n\t> Your Resources \n\n\t` + resource.title)
//       return resource;
//   }
//   return null
// }

// export function viewAllResources() : void {
//   const creatorsValues = creators.values();

//   let resource : Resource;
  
//   for (let i = 0; i < creators.size; i++) {
//     resource = resources.getSome(creatorsValues[i]);
//       logging.log(`\n\n\t> Owner : ${resource.creator} \n\n\t` + resource)
//   }
// }

// NOTE: END

// ----------------------------------
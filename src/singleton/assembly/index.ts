import { storage, Context, logging } from "near-sdk-core"
import { Resource, Vote, resources, Category, creators} from "./models"
import { AccountId, PAGE_SIZE } from "../../utils"





// NOTE: resources is stored in PersistentVector
export function addResource(accountId: AccountId, title: string, url: string, category: Category): void {
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




// ----------------------------------

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
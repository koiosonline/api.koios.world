# koios-faucet

## Intro
Koios-faucet is a back-end service for the Koios platform. It is primarily used as a middleware for handling certain functions that should be done off-chain. 

## Architecture
The architecture currently follows a layered pattern, keep in mind this may be upgraded to a microservices architecture if we need more scaling. Modules can talk down but not up. For example, a service should not be able to call a controller and a controller should not be able to call a router. 

### Folder structure

- Routes, the different API endpoints the client is able to call. The requests get routed to their corresponding controler.
- Controllers, this is where the API requests get handled through the different endpoints. 
- Services, controllers call their corresponding service, in the service business logic gets handled. 
- Repositores, when a service needs to make a call to a database it will be handled within its corresponding repository component (not created yet not needed)
- Interfaces, folder for all the interfaces that are being used. 
- Json, folder for static .json data. 

## Adding a new endpoint
For adding a new endpoint a few things need to be created, let's call the new endpoint: NFT. We want to get NFTs from a certain address. 

### Creating the routes
In the routes folder create a new: NFTRouter.ts

```typescript
import express from "express";

//Don't worry about the controller yet
import * as NFTController from "../controllers/NFTController";
export const NFTRouter = express.Router();

NFTRouter.route("/:address").get(NFTController.get);
````

### Creating the Controller
In the controller folder create a new: NFTController.ts

```typescript
import { NextFunction, Request, Response } from "express";

//Don't worry about the service in this step yet
import { fetchNFTs } from "../services/NFTService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const NFTs = await fetchNFTs(req.params.address);
  if (NFTs) {
    return res.send(NFTs);
  }
};
````

### Creating the Service
In the services folder create a new: NFTService.ts

````typescript
export const fetchNFTs = async (address: string) => {
const fetchedNFTs = //fetch NFTs implementation;
 return NFTs
};
````

Using this pattern may cost some more time in the beginning, but it makes everything much more expandable and manageable. 

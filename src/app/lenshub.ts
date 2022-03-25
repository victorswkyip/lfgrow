import { ethers } from 'ethers';
import { LENS_HUB_ABI, LENS_HUB_CONTRACT, MOCK_PROFILE_CREATION_ABI, MOCK_PROFILE_CREATION_CONTRACT  } from './config';
import { getSigner } from './services/lens-api/ethers.service';

// lens contract info can all be found on the deployed
// contract address on polygon.
export const lensHub = new ethers.Contract(
  LENS_HUB_CONTRACT,
  LENS_HUB_ABI,
  getSigner()
);


// lens contract info can all be found on the deployed
// contract address on polygon.
export const mockCreateProfile = new ethers.Contract(
  MOCK_PROFILE_CREATION_CONTRACT,
  MOCK_PROFILE_CREATION_ABI,
  getSigner()
);


import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Moralis } from 'moralis/dist/moralis.min.js';
import { mockCreateProfile } from '../lenshub';
import { getAddressFromSigner, getSigner } from '../services/lens-api/ethers.service';
import { CreateProfileDataStruct } from '../services/lens-api/typechain-types/LensHub';


@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.component.html',
  styleUrls: ['./profile-creation.component.css']
})
export class ProfileCreationComponent implements AfterViewInit {

  constructor(private router: Router) { }
  ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  profileHandle: string;
  profileDescription: string;

  // @ViewChild('fileInput', { static: false }) fileInput: any;

  fileInput: any;

  ngAfterViewInit(): void {
    const fileInput = document.getElementById("fileInput");
    this.fileInput = fileInput;
  }

  uploadImage = async () => {
    // Save file input to IPFS
    const data = this.fileInput.files[0]
    const file = new Moralis.File(data.name, data)
    await file.saveIPFS();
    // console.log(file.ipfs(), file.hash());
    return file.ipfs();
  }

  getProfileImageURI = async (imageURL) => {
    const name = this.profileHandle;
    const description = this.profileDescription;
    const metadata = {
      "name": name,
      "description": description,
      "image": imageURL,
      "animation_url": imageURL,
      // "attributes": [
      //   {
      //     "trait_type": "type",
      //     "value": "value"
      //   },
      //   {
      //     "trait_type": "type2",
      //     "value": "value2"
      //   },
      // ]
    }
    const file = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
    await file.saveIPFS();
    // console.log(file.ipfs(), file.hash());
    return file.ipfs();
  }

  // TODO: fix flaw where if it ends up failing the contract tx to create profile, then we wasted resources uploading to ipfs
  submitProfileInput = async () => {
    const image = await this.uploadImage();
    const imageURI = await this.getProfileImageURI(image);
    await this.createProfile(imageURI);
  }

  async createProfile(imageURI: string): Promise<void> {
    const inputStruct: CreateProfileDataStruct = {
      to: getAddressFromSigner(),
      handle: this.profileHandle,
      imageURI: imageURI,
      followModule: this.ZERO_ADDRESS,
      followModuleData: [],
      followNFTURI: 'null',
    };
    // console.log(inputStruct);
    await mockCreateProfile.connect(getSigner()).proxyCreateProfile(inputStruct).then(() => {

      this.router.navigate(["select-profile"]).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      });
    });
  }


}

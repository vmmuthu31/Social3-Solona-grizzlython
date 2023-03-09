import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { v4 as uuidv4 } from "uuid";
import { useCreatePost, SDK } from '@gumhq/react-sdk';
import { uploadToIPFS} from "../utils/ipfs";
import localStorage from "localStorage"

interface Props {
  sdk: SDK;
}

// Use this function if you want to create a post without using the react-sdk
export const handleCreatePost = async (metadataUri: String, profilePDA: PublicKey, userPDA: PublicKey, user: PublicKey, sdk: SDK) => {
  const post = await sdk.post.create(metadataUri, profilePDA, userPDA, user);
  await post.instructionMethodBuilder.rpc();
};

const CreatePost = ({ sdk }: Props) => {
  const wallet = useWallet();

  const [userProfileAccounts, setUserProfileAccounts] = useState<any>([]);
  const [selectedProfileOption, setSelectedProfileOption] = useState<any>(null);
  const { create, postPDA, error, loading } = useCreatePost(sdk);
  const [contentofpost, SetContentofpost] = useState('')
  const post =async (contentofpost:String) => {
    const metadata_id = uuidv4();
      const ipfsResult = await uploadToIPFS({
        metadata_id,
        content: {
          content: contentofpost,
          format: "markdown",
        },
        type: "text",
        authorship: {
          signature: "signature",
          publicKey: PublicKey.toString(),
        },
      });
      console.log(
        "ipfsResult",
        `https://${ipfsResult}.ipfs.dweb.link/${metadata_id}.json`
      );
      const postlink =  `https://${ipfsResult}.ipfs.dweb.link/${metadata_id}.json`
      localStorage.setItem('ipfsResult', postlink);
  }
  const postlink = post(contentofpost);
  const metadataUri = localStorage.getItem('ipfsResult')
      
      
  useEffect(() => {
    if (!wallet.connected) return;
    sdk.profile.getProfileAccountsByUser(wallet.publicKey as PublicKey)
      .then((accounts) => {
        if (!accounts) return;
        const profileOptions = accounts.map((account) => {
          return {
            profilePDA: account.publicKey.toBase58(),
            userPDA: account.account.user.toBase58(),
          }
        });
        setUserProfileAccounts(profileOptions[0]);
        if (profileOptions.length === 1) {
          setSelectedProfileOption(profileOptions[0]);
        }
      });

  }, [wallet.connected]);
    const  profile = userProfileAccounts?.profilePDA
    const  user =  userProfileAccounts?.userPDA
 
  console.log("userprofile", userProfileAccounts)
  return (
    <div>
      <section aria-labelledby="post">
                    <div className=" rounded-lg shadow">
                      <div className="flex justify-between px-12 text-xl p-3 font-bold">
                        
                        <div>Upload the POST</div>
                      </div>
                      <div className="flex space-x-5  text-3xl p-5  font-bold">
                        <h1></h1>
                        <div>
                          <textarea
                            type="text"
                            onChange={(e) => SetContentofpost(e.target.value)}
                            value={contentofpost}
                            placeholder="What Happening?"
                            maxlength="150"
                            cols="30"
                            rows="1"
                            className=" overflow-hidden outline-none"
                          />
                          <i></i>

                          <button
                        //  disabled={!selectedProfileOption}
                         onClick={(event) => {
                           event.preventDefault();
                           create(metadataUri, profile, user, wallet.publicKey as PublicKey);
                         }}
                            className="w-lg items-end  my-5 flex justify-end py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {" "}
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
    </div>
  );
};

export default CreatePost;

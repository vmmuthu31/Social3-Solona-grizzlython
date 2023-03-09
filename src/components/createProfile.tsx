import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css'
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react'; 
import { SDK, useCreateProfile } from '@gumhq/react-sdk';
import { v4 as uuidv4 } from "uuid";
import { uploadToIPFS} from "../utils/ipfs";
import localStorage from "localStorage"

type Namespace = "Professional" | "Personal" | "Gaming" | "Degen";

interface Props {
  sdk: SDK;
}

export const handleCreateProfile = async (
  userPDA: PublicKey,
  namespace: Namespace,
  user: PublicKey,
  sdk: SDK
) => {
  if (!userPDA) return;
  const program = await sdk.profile.create(userPDA, namespace, user);
  await program.instructionMethodBuilder.rpc();
};

const CreateProfile = ({sdk}: Props) => {
  const wallet = useWallet();
  const userPublicKey = wallet.publicKey as PublicKey;
  const [usersList, setUsersList] = useState([]);
  const [name, SetName] = useState('')
  const [bio, SetBio] = useState('')
  const [username, SetUsername] = useState('')
  const [avatar, SetAvatar] = useState('')
  const [selectedUserOption, setSelectedUserOption] = useState("");
  const { create, profilePDA, error, loading } = useCreateProfile(sdk);
  const Profile = async (name:any, bio: String, username:String, avatar: String) => {
    if (usersList.length > 0) return;
    try {
      const metadata_id = uuidv4();
      const ipfsResult = await uploadToIPFS({
        metadata_id,
        name: name,
        bio: bio,
        username: username,
        avatar: avatar,
      });
      const profilelink = `https://${ipfsResult}.ipfs.dweb.link/${metadata_id}.json`
      localStorage.setItem('profileResult', profilelink);
    } catch (error) {
      console.log("error", error);
    }
  };
  const selectedNamespaceOption ="Professional"
  const profilelink = Profile(name,bio,username,avatar);
  const metadataUri = localStorage.getItem('profileResult')
  useEffect(() => {
    if (!wallet.connected) return;
    const init = async () => {
      const users = await sdk.user.getUserAccountsByUser(userPublicKey) as any;
      const usersList = users.map((user: any) => user.publicKey.toBase58());
      setUsersList(usersList[0]);
      if (usersList.length > 0) {
        setSelectedUserOption(usersList[0]);
      }
    };
    init();
  }, [wallet.connected]);

  return (
    <div className={`${styles.minimize}`}>
     
      <div className={`${styles.field}`}>
        <label className={`${styles.label}`}>Enter Name:</label>
        <input
          type="text"
          value={name}
          onChange={(event) => SetName(event.target.value)}
          className={`${styles.input}`}
        />
        <label className={`${styles.label}`}>Enter Username:</label>
        <input
          type="text"
          value={username}
          onChange={(event) => SetUsername(event.target.value)}
          className={`${styles.input}`}
        />
        <label className={`${styles.label}`}>Enter Bio:</label>
        <input
          type="text"
          value={bio}
          onChange={(event) => SetBio(event.target.value)}
          className={`${styles.input}`}
        />
        <label className={`${styles.label}`}>Enter Avatar Url:</label>
        <input
          type="text"
          value={avatar}
          onChange={(event) => SetAvatar(event.target.value)}
          className={`${styles.input}`}
        />     
      </div>
    
      <button
        className={`${styles.button}`}
        onClick={async (event) => {
          event.preventDefault();
          create(metadataUri, selectedNamespaceOption, new PublicKey(selectedUserOption), userPublicKey);
        }}
      >
        Create Profile
      </button>
    </div>
  );
};

export default CreateProfile;

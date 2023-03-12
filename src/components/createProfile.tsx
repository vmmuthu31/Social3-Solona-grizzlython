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
  myState: string | undefined;
}

interface UserProfile {
  name: string;
  bio: string;
  username: string;
  avatar: string;
}

const CreateProfile = ({ sdk }: Props) => {
  const wallet = useWallet();
  const userPublicKey = wallet.publicKey as PublicKey;
  const [usersList, setUsersList] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    bio: '',
    username: '',
    avatar: '',
  });
  const [selectedUserOption, setSelectedUserOption] = useState('');
 
  const [metadataUri, setMetadataUri] = useState('');

  const { create, profilePDA, error, loading } = useCreateProfile(sdk);

  useEffect(() => {
    if (!wallet.connected) return;

    const init = async () => {
      const users = await sdk?.user.getUserAccountsByUser(userPublicKey) as any;
      const usersList = users?.map((user: any) => user.publicKey.toBase58()) || [];
      setUsersList(usersList);

      if (usersList.length > 0) {
        setSelectedUserOption(usersList[0]);
      }
    };

    init();
  }, [wallet.connected]);

  const handleUserProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleCreateProfile = async () => {
    // if (usersList.length > 0) return;

    try {
      const metadata_id = uuidv4();
      const ipfsResult = await uploadToIPFS({
        metadata_id,
        ...userProfile,
      });
      const profilelink = `https://${ipfsResult}.ipfs.dweb.link/${metadata_id}.json`;
      setMetadataUri(profilelink);
      console.log(profilelink);
    } catch (error) {
      console.log('error', error);
    }
   const selectedNamespaceOption= "Professional"

    setTimeout(() => {
      create(metadataUri, selectedNamespaceOption, new PublicKey(selectedUserOption), userPublicKey);
    }, 2000);
  };
  

  return (
      <div className={styles.minimize}>
        <div className={styles.field}>
          <label className={styles.label}>Enter Name:</label>
          <input
            type="text"
            value={userProfile.name}
            onChange={(event) => handleUserProfileChange('name', event.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>Enter Username:</label>
          <input
            type="text"
            value={userProfile.username}
            onChange={(event) => handleUserProfileChange('username', event.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>Enter Bio:</label>
          <input
            type="text"
            value={userProfile.bio}
            onChange={(event) => handleUserProfileChange('bio', event.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>Enter Avatar Url:</label>
          <input
            type="text"
            value={userProfile.avatar}
            onChange={(event) => handleUserProfileChange('avatar', event.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>Select Namespace:</label>
         
          <button className={styles.button} onClick={handleCreateProfile}>Create Profile</button>
        </div>
      </div>
);
};

export default CreateProfile;      

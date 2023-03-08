import { Web3Storage } from "web3.storage";

export const uploadToIPFS = async (data: { metadata_id: string, content: { content: string, format: string }, type: string, authorship: { signature: string, publicKey: string } }) => {
    const client = new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY!,
    });
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const file = [new File([blob], `${data.metadata_id}.json`)];
    console.log(file);
    const uploadResponse = await client.put(file);
    return uploadResponse;
  };
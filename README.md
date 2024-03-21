# AI NFT Generator

Link: https://ai-nft-generator-orcin.vercel.app/

## Overview

AI NFT Generator is a decentralized application (DApp) that leverages artificial intelligence (AI) to generate unique NFTs based on user descriptions. This project combines the power of blockchain technology with AI to create a unique and engaging experience for users interested in digital art and collectibles.

## Features

- AI-Generated Art: Utilizes an AI model to generate unique images based on user descriptions.
- NFT Minting: Allows users to mint their AI-generated art as NFTs on the Ethereum blockchain.
- IPFS Storage: Stores the generated images on IPFS using NFT.Storage, ensuring decentralized and permanent storage.
- ERC721 Compliance: Minted NFTs are compliant with the ERC721 standard, making them compatible with various Ethereum-based services and marketplaces.

## Usage

1. Connect Wallet: Connect your MetaMask wallet to the DApp.
2. Create NFT: Enter a description for your NFT. The AI will generate an image based on your description.
3. Mint NFT: Once you're satisfied with the generated image, click "Create & Mint" to mint your NFT.
4. View Metadata: After minting, you can view the metadata of your NFT by clicking the provided link.

### `Smart Contract`

The smart contract for this project is an ERC721 compliant contract that allows for the minting of NFTs. It includes functions for minting new NFTs, burning existing NFTs, and retrieving the metadata URI for a given token ID.

### `Axios and Stable Diffusion Integration`
The `createImage` function is a crucial part of your application, leveraging Axios to make HTTP requests to the Stable Diffusion API. This function is responsible for generating unique images based on user descriptions, showcasing the power of AI in creating art.

### `How It Works`
1. Initialization: The function starts by setting a message to indicate that the image generation process has begun.
2. API Request: It constructs a URL for the Stable Diffusion API endpoint and prepares an Axios request. The request includes:
    - The URL of the Stable Diffusion API.
    - The HTTP method set to POST.
    - Headers containing the authorization token for the Hugging Face API, specifying the content type as JSON.
    - The request body, which is a JSON string containing the user's description and options for the AI model.
3. Response Handling: Upon receiving a response from the API, the function extracts the content type and the image data from the response. It then converts the image data to a base64-encoded string and constructs an image URL. This URL is used to display the generated image in the application.
4. State Update: The function updates the application's state with the generated image URL, allowing the user to see the result of their description.

### `Example Code`
```
const createImage = async () => {
 setMessage("Generating Image...");

 const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`;

 const response = await axios({
    url: URL,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      inputs: description, options: { wait_for_model: true },
    }),
    responseType: 'arraybuffer',
 });

 const type = response.headers['content-type'];
 const data = response.data;

 const base64data = Buffer.from(data).toString('base64');
 const img = `data:${type};base64,` + base64data;
 setImage(img);

 return data;
};
```

### `Integration with the Application`
This function is integrated into the application flow, allowing users to input a description, generate an image based on that description, and then proceed to mint the generated image as an NFT. The use of Axios for API requests and the Stable Diffusion AI model for image generation showcases the innovative use of AI in creating unique digital art pieces.

By leveraging the Stable Diffusion API, your application can generate photo-realistic images from text inputs, providing a unique and engaging experience for users interested in digital art and collectibles. This integration not only enhances the functionality of your AI NFT Generator but also demonstrates the potential of AI in creative applications.

## Security and Trust

AI NFT Generator places a high emphasis on security and trust. It uses secure practices for handling user data and transactions, ensuring that users' information is protected.

## Acknowledgments
- Special thanks to the Ethereum and Solidity communities for their support and resources.
- Acknowledgment to Hugging Face for providing the AI model used for generating images.
- Acknowledgment to NFT.Storage for providing a decentralized storage solution for NFTs.

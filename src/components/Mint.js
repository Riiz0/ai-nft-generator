import { useState } from "react"
import axios from 'axios';
import { Buffer } from 'buffer';
import { NFTStorage, File } from 'nft.storage'

const Mint = () => {
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  
  const submitHandler = async (e) => {
    e.preventDefault()

    //Calling AI API to generate a image based on description
    const imageData = createImage()
  }

  const uploadImage = async (imageData) => {
    console.log("Upload Image...")
    
    //Create instance to NFT.Storage
   const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY })

  }

  const createImage = async () => {
    console.log("Generating Image...")

    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`

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
    })

    const type = response.headers['content-type']
    const data = response.data

    const base64data = Buffer.from(data).toString('base64')
    const img = `data:${type};base64,` + base64data
    setImage(img)

    return data
  }

    return (
      <div className="mint-container">
        <div className="input-boxes">
          <form onSubmit={submitHandler}>
            <input type="text" placeholder="Create a Topic..." onChange={(e) => {setTopic(e.target.value)}}/>
            <textarea name="description" placeholder="Create a Description..."onChange={(e) => {setDescription(e.target.value)}}></textarea>
            <input type="submit" value="Create and Mint" />
          </form>
        </div>
  
        <div className="image">
          <img src={image} alt="AI Generated NFT Image" />
        </div>
      </div>
    );
  }
  
  export default Mint;

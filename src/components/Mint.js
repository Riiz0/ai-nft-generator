const Mint = () => {
    return (
      <div className="mint-container">
        <div className="input-boxes">
          {/* Box - Topic Input */}
          <form>
            <input type="text" placeholder="Enter your topic" />
          </form>
  
          {/* Box - Description Input */}
          <form>
            <textarea name="description" placeholder="Describe your topic"></textarea>
          </form>
  
          {/* Box - Create and Mint Button */}
          <form>
            <input type="submit" value="Create and Mint" />
          </form>
        </div>
  
        {/* Box - Image Display */}
        <div className="image">
          <img src="path/to/your/image" alt="Minted NFT" />
        </div>
      </div>
    );
  }
  
  export default Mint;
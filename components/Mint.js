export function Mint({mintFunc, passId}) {
    return (   
        <div> 
        <button onClick={mintFunc}>
          mint
          
        </button>
        <p>
          {passId}
        </p>
        </div>
    )
  }


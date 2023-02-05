export function CheckAddress({ funcAddress, checkAddr }) {
    return (   
      <div>
        <button onClick={funcAddress}> check address</button>
        <p>{checkAddr}</p>
      </div>
    )
  }
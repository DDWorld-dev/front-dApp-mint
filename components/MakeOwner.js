export function MakeOwner({ funcMakeOwn, ErrMsg }) {
    return (   
      <div>
         <button onClick={funcMakeOwn}> make owner </button>
      <p> {ErrMsg}</p>
      </div>
    )
  }
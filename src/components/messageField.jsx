'use client'

import {useSetsStore} from '@/app/stores/useSetsStore'


export default function MessageField() {

const { showMessageField, messageKey, pendingDeleteId, deleteSet, cancelDelete, sets} = useSetsStore();

let message = ``;

switch(messageKey){
   case "confirm-delete": {
      message = `Are you sure you want to delete "${sets.find(set => set.id === pendingDeleteId).name}" This can't be undone?`}
}

return (
    <div className="message-field" style={showMessageField ? {display: "flex"} : {display: "none"}}>
      {messageKey === "confirm-delete" && <div className="message"><p>{message} </p>
      <div className="confirm-delete-btn-wrapper">
      <button className="button-confirm-delete" onClick={() => deleteSet(pendingDeleteId)}>Delete</button>   
      <button className="button-cancel-delete" onClick={() => cancelDelete()}>Cancel</button>   
      </div></div>}
    </div>
   )
}
import { atom } from 'jotai'

export const currentMessageAtom = atom(""); 
export const messageListAtom = atom([]);

const insertMsg = (msgs, data)=>[...msgs, {
  id : data.id,
  room: data.room,
  author: data.author,
  message: data.message,
  time: data.time
}];

export const setMessageListAtom = atom(
  ()=> "",
  (get,set, data)=>{
    set(messageListAtom, insertMsg( get(messageListAtom),data) );
    set(currentMessageAtom,"");
});

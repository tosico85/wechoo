import React, { useState } from "react";
import { dbService } from "fbase";

const Nweet = ({ nweetObj, userObj }) => {
  const isOwner = nweetObj.creator === userObj.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState("");

  const onDelete = async () => {
    const ok = window.confirm("delete??");
    ok && (await dbService.collection("nweet").doc(nweetObj.id).delete());
  };

  const changeText = (e) => {
    const {
      target: { value },
    } = e;
    setNewText(value);
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setNewText(nweetObj.text);
    }
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("nweet").doc(nweetObj.id).update({
      text: newText,
    });
    toggleEdit();
  };

  return (
    <>
      {isEditing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              name="newText"
              onChange={changeText}
              value={newText}
              type="text"
            />
            <input type="submit" value="Nweet" />
          </form>
          <input type="submit" value="Edit" />
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <div>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDelete}>Delete Nweet</button>
              <button onClick={toggleEdit}>Edit Nweet</button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Nweet;

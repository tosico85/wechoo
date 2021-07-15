import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Nweet from "./Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  /* const getNweets = async () => {
    const docs = await dbService.collection("nweet").get();
    docs.forEach((doc) => {
      const { id } = doc;
      const docData = doc.data();
      setNweets((pre) => [{ id, ...docData }, ...pre]);
    });
  }; */

  useEffect(() => {
    dbService.collection("nweet").onSnapshot((snapshot) => {
      const docs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => b.createAt - a.createAt);
      console.log(docs);
      setNweets(docs);
    });
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(nweet);

    await dbService.collection("nweet").add({
      text: nweet,
      creator: userObj.uid,
      createAt: Date.now(),
    });
    //console.log(">>>> result : " + JSON.stringify(result));

    setNweet("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="nweet"
          placeholder="What's on your mind?"
          value={nweet}
          onChange={onChange}
          type="text"
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} userObj={userObj} />
        ))}
      </div>
    </div>
  );
};

export default Home;

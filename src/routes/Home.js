import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Question from "./Question";

const Home = ({ userObj }) => {
  const [question, setQuestion] = useState("");
  const [itemA, setItemA] = useState("");
  const [itemB, setItemB] = useState("");
  const [questions, setQuestions] = useState([]);

  /* const getquestions = async () => {
    const docs = await dbService.collection("question").get();
    docs.forEach((doc) => {
      const { id } = doc;
      const docData = doc.data();
      setQuestions((pre) => [{ id, ...docData }, ...pre]);
    });
  }; */

  useEffect(() => {
    dbService
      .collection("Question")
      .orderBy("createAt", "desc")
      .onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          pickCountA: 0,
          pickCountB: 0,
        }));

        setQuestions(docs);
      });
  }, []);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "question") {
      setQuestion(value);
    } else if (name === "itemA") {
      setItemA(value);
    } else if (name === "itemB") {
      setItemB(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(question);

    await dbService.collection("Question").add({
      question,
      itemA,
      itemB,
      creator: userObj.uid,
      createAt: Date.now(),
    });
    //console.log(">>>> result : " + JSON.stringify(result));

    setQuestion("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <span>question</span>
        <input
          name="question"
          placeholder="무엇을 선택하시겠습니까?"
          value={question}
          onChange={onChange}
          type="text"
        />
        <div>
          <input
            type="text"
            name="itemA"
            placeholder="A안"
            value={itemA}
            onChange={onChange}
          />
          <input
            type="text"
            name="itemB"
            placeholder="B안"
            value={itemB}
            onChange={onChange}
          />
        </div>
        <input type="submit" value="question" />
      </form>
      <div>
        {questions.map((question) => (
          <Question
            key={question.id}
            questionObj={question}
            userObj={userObj}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

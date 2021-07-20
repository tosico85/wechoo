import React, { useState, useEffect } from "react";
import { dbService } from "fbase";

const Question = ({ questionObj, userObj }) => {
  const isOwner = questionObj.creator === userObj.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newItemA, setNewItemA] = useState("");
  const [newItemB, setNewItemB] = useState("");
  const [pickCount, setPickCount] = useState({});
  const [answerList, setAnswerList] = useState([]);

  const onDelete = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    ok && (await dbService.collection("Question").doc(questionObj.id).delete());
  };

  const changeQuestion = (e) => {
    const {
      target: { name, value },
    } = e;

    if (name === "newQuestion") {
      setNewQuestion(value);
    } else if (name === "newItemA") {
      setNewItemA(value);
    } else if (name === "newItemB") {
      setNewItemB(value);
    }
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setNewQuestion(questionObj.question);
      setNewItemA(questionObj.itemA);
      setNewItemB(questionObj.itemB);
    }
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    dbService
      .collection("Answer")
      .where("qid", "==", questionObj.id)
      .onSnapshot((snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAnswerList(result);
        //console.log(answerCount);
        setPickCount({
          pickCountA: result.filter((answer) => answer.pickCode === "A").length,
          pickCountB: result.filter((answer) => answer.pickCode === "B").length,
        });
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("Question").doc(questionObj.id).update({
      question: newQuestion,
      itemA: newItemA,
      itemB: newItemB,
    });
    toggleEdit();
  };

  const onPick = async (pickCode) => {
    if (answerList.find(({ uid }) => uid === userObj.uid)) {
      alert("이미 선택하셨습니다.");
      return;
    }

    await dbService.collection("Answer").add({
      qid: questionObj.id,
      uid: userObj.uid,
      pickCode,
      createAt: Date.now(),
    });
  };

  return (
    <>
      {isEditing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              name="newQuestion"
              onChange={changeQuestion}
              value={newQuestion}
              type="text"
            />
            <div>
              <input
                name="newItemA"
                onChange={changeQuestion}
                value={newItemA}
                type="text"
              />
              <input
                name="newItemB"
                onChange={changeQuestion}
                value={newItemB}
                type="text"
              />
            </div>
            <input type="submit" value="Edit" />
            <button onClick={toggleEdit}>Cancel</button>
          </form>
        </>
      ) : (
        <div>
          <h4>{questionObj.question}</h4>
          <div>
            <div>
              <span>{pickCount.pickCountA}</span>
              <button onClick={() => onPick("A")}>{questionObj.itemA}</button>
            </div>
            <span> VS </span>
            <div>
              <span>{pickCount.pickCountB}</span>
              <button onClick={() => onPick("B")}>{questionObj.itemB}</button>
            </div>
          </div>
          {isOwner && (
            <div className="edit-buttons">
              <button onClick={onDelete}>Delete Question</button>
              <button onClick={toggleEdit}>Edit Question</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Question;

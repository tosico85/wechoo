import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import QuestionForm from "./QuestionForm";

const Question = ({ questionObj, userObj }) => {
  const isOwner = questionObj.creator === userObj.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [pickCount, setPickCount] = useState({});
  const [answerList, setAnswerList] = useState([]);

  const onDelete = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (ok) {
      await dbService.collection("Question").doc(questionObj.id).delete();
      await clearImages();
    }
  };

  const clearImages = async () => {
    if (questionObj.imageUrlA) {
      await storageService.refFromURL(questionObj.imageUrlA).delete();
    }
    if (questionObj.imageUrlB) {
      await storageService.refFromURL(questionObj.imageUrlB).delete();
    }
  };

  //
  const toggleEdit = () => {
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
  }, [questionObj.id]);

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
          <div className="div-line"></div>
          <QuestionForm
            userObj={userObj}
            questionObj={questionObj}
            toggleEdit={toggleEdit}
          />
        </>
      ) : (
        <div className="question-card">
          <span className="question__title">{questionObj.question}</span>
          <div className="question__items">
            <div onClick={() => onPick("A")} className="quest-item">
              <img
                className="item-image"
                src={questionObj.imageUrlA}
                alt="A안 이미지"
              />
              <span className="item-count">{pickCount.pickCountA}</span>
              <span className="item-desc">{questionObj.itemA}</span>
            </div>
            <div onClick={() => onPick("B")} className="quest-item">
              <img
                className="item-image"
                src={questionObj.imageUrlB}
                alt="B안 이미지"
              />
              <span className="item-count">{pickCount.pickCountB}</span>
              <span className="item-desc">{questionObj.itemB}</span>
            </div>
          </div>
          <div className="question-edit">
            {isOwner && (
              <div className="edit-buttons">
                <button onClick={onDelete}>삭제</button>
                <button onClick={toggleEdit}>수정</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Question;

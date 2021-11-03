import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Question from "./Question";
import QuestionForm from "./QuestionForm";

const Home = ({ userObj }) => {
  const [isReg, setIsReg] = useState(false);
  const [questions, setQuestions] = useState([]);

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

  const toggleNew = () => {
    setIsReg((prev) => !prev);
  };

  return (
    <>
      {!isReg && (
        <div className="sub-header">
          <button className="reg-button__question" onClick={toggleNew}>
            Add
          </button>
        </div>
      )}
      <div className="home-main main">
        {isReg && <QuestionForm userObj={userObj} toggleEdit={toggleNew} />}
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
    </>
  );
};

export default Home;

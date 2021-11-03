import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { useInput } from "hooks/useInput";

const QuestionForm = ({ userObj, questionObj = null, toggleEdit = null }) => {
  const inputQuestion = useInput((questionObj && questionObj.question) || "");
  const inputItemA = useInput((questionObj && questionObj.itemA) || "");
  const inputItemB = useInput((questionObj && questionObj.itemB) || "");
  const [attachImageA, setAttachImageA] = useState("");
  const [attachImageB, setAttachImageB] = useState("");

  useEffect(() => {
    if (questionObj) {
      setAttachImageA("");
      setAttachImageB("");
      document.querySelector("input[name='fileA']").value = null;
      document.querySelector("input[name='fileB']").value = null;
    }
  }, [questionObj]);

  const clearImages = async () => {
    if (questionObj.imageUrlA && attachImageA) {
      await storageService.refFromURL(questionObj.imageUrlA).delete();
    }
    if (questionObj.imageUrlB && attachImageB) {
      await storageService.refFromURL(questionObj.imageUrlB).delete();
    }
  };

  //Firebase Image upload function
  const imageUpload = async (attachImage) => {
    let downloadUrl = "";

    if (attachImage) {
      const imageUploadRef = storageService
        .ref()
        .child(`images/${userObj.uid}/${uuidv4()}`);

      const result = await imageUploadRef.putString(attachImage, "data_url");
      downloadUrl = await result.ref.getDownloadURL();
    }
    return downloadUrl;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    //upload image
    const imageUrlA = await imageUpload(attachImageA);
    const imageUrlB = await imageUpload(attachImageB);

    if (questionObj) {
      //수정 요청인 경우 - 기존 이미지 삭제
      await clearImages();

      await dbService
        .collection("Question")
        .doc(questionObj.id)
        .update({
          question: inputQuestion.value,
          itemA: inputItemA.value,
          itemB: inputItemB.value,
          imageUrlA: imageUrlA ? imageUrlA : questionObj.imageUrlA,
          imageUrlB: imageUrlB ? imageUrlB : questionObj.imageUrlB,
        });
    } else {
      await dbService.collection("Question").add({
        question: inputQuestion.value,
        itemA: inputItemA.value,
        imageUrlA,
        itemB: inputItemB.value,
        imageUrlB,
        creator: userObj.uid,
        createAt: Date.now(),
      });

      // setQuestion("");
      setAttachImageA(null);
      setAttachImageB(null);
      document.querySelector("input[name='fileA']").value = null;
      document.querySelector("input[name='fileB']").value = null;
    }
    toggleEdit();
  };

  const onFileChange = (event) => {
    const {
      target: { name, files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = (loadFile) => {
      const {
        currentTarget: { result },
      } = loadFile;

      if (name === "fileA") {
        setAttachImageA(result);
      } else if (name === "fileB") {
        setAttachImageB(result);
      }

      //console.log(attachImageA);
    };

    reader.readAsDataURL(theFile);
  };

  const cancelImage = (event) => {
    event.preventDefault();

    const {
      target: { name },
    } = event;

    let fileSelector;
    if (name === "cancelImageA") {
      fileSelector = document.querySelector("input[name='fileA']");
      setAttachImageA(null);
    } else if (name === "cancelImageB") {
      fileSelector = document.querySelector("input[name='fileB']");
      setAttachImageB(null);
    }
    fileSelector.value = null;
  };

  return (
    <form className="form-question" onSubmit={onSubmit}>
      <input
        name="question"
        placeholder="Title *"
        {...inputQuestion}
        className="question-title"
        type="text"
        required
      />
      <div className="div-line"></div>
      <div className="form-question__select select-items">
        <div className="select-items__input">
          <input
            type="text"
            name="itemA"
            className="item__input-text"
            placeholder="선택1 *"
            {...inputItemA}
            required
          />
          <input
            type="file"
            name="fileA"
            className="item__file-attach"
            accept="image/*"
            placeholder="첨부파일1"
            onChange={onFileChange}
          />
          {attachImageA && (
            <div className="preview-image">
              <img src={attachImageA} alt="A안 이미지" />
              <button name="cancelImageA" onClick={cancelImage}>
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="div-line"></div>
        <div className="select-items__input">
          <input
            type="text"
            name="itemB"
            className="item__input-text"
            placeholder="선택2 *"
            {...inputItemB}
            required
          />
          <input
            type="file"
            name="fileB"
            className="item__file-attach"
            accept="image/*"
            placeholder="첨부파일2"
            onChange={onFileChange}
          />
          {attachImageB && (
            <div className="preview-image">
              <img src={attachImageB} alt="B안 이미지" />
              <button name="cancelImageB" onClick={cancelImage}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="question-buttons">
        <button className="question-cancel" onClick={toggleEdit}>
          취 소
        </button>
        <input
          className="question-submit"
          type="submit"
          value={questionObj ? "수 정" : "등 록"}
        />
      </div>
    </form>
  );
};

export default QuestionForm;

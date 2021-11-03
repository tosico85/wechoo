/* import { storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";

//Firebase Image upload function
export const imageUpload = async (userId, attachImage) => {
  let downloadUrl = "";

  if (attachImage) {
    const imageUploadRef = storageService
      .ref()
      .child(`images/${userId}/${uuidv4()}`);

    const result = await imageUploadRef.putString(attachImage, "data_url");
    downloadUrl = await result.ref.getDownloadURL();
  }
  return downloadUrl;
};
 */

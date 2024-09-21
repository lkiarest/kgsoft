const BASE_URI = 'https://ai.kgsoft.cn'
const APIS = {
  matting: `${BASE_URI}/human_matting`,
  id_photo: `${BASE_URI}/idphoto`,
}

interface ResultType {
  status: boolean
  image_base64?: string
  image_base64_hd?: string
  image_base64_standard?: string
}

const requestApi = async (url, imgFile, height, width): Promise<ResultType> => {
  const formData = new FormData();
  formData.append("input_image", imgFile);
  formData.append("height", height);
  formData.append("width", width);

  const response = await fetch(url, {
      method: 'POST',
      body: formData
  });

  const result = await response.json();
  return result;
}

/** 人像抠图接口 */
export async function generateMatting(imgFile: File, height, width) {
  return requestApi(APIS.matting, imgFile, height, width);
}

/** 证件照接口 */
export async function generateIdPhoto(imgFile: File, height, width) {
  return requestApi(APIS.id_photo, imgFile, height, width);
}

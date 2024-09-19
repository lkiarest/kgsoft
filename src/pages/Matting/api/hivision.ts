export async function generateIdPhoto(imgFile: File, height, width): Promise<{status: boolean, image_base64: string}> {
  const url = "https://ai.kgsoft.cn/human_matting";
  const formData = new FormData();
  formData.append("input_image", imgFile);
  formData.append("height", height);
  formData.append("width", width);

  const response = await fetch(url, {
      method: 'POST',
      body: formData
  });

  const result = await response.json();
  console.log(result);
  return result;
}

import { useCallback, useEffect, useState } from 'preact/hooks';
import Button from 'preact-material-components/Button';
import ImgSelector from '../../../components/ImgSelector';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import CompressSetting from '../../../components/CompressSetting';
import ImgList from './ImgList';
import * as wasm from "../../../wasm/img-compress/wasm_test";
import { formatSize } from '../../../utils/img';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';
import 'preact-material-components/Slider/style.css';
import 'preact-material-components/Switch/style.css';
import './style.less';

export function MultipleImageCompress() {
	useDocumentTitle()
	const [imgFiles, setImageFiles] = useState<File[]>([]);
	const [imageDimensions, setImageDimensions] = useState<string[]>([]);
  const [rate, setRate] = useState(75)
	const [imgWidth, setImgWidth] = useState(0);
	const [imgHeight, setImgHeight] = useState(0);
	const [resizeEnabled, setResizeEnabled] = useState(false);
	const [resizeWidth, setResizeWidth] = useState(0);
	const [resizeHeight, setResizeHeight] = useState(0);
	const [compressedImgs, setCompressedImgs] = useState([]);
	const [compressedSizes, setCompressedSizes] = useState([]);
	const [allImagesSameSize, setAllImagesSameSize] = useState(false);
  const [compressing, setCompressing] = useState(false)

	const checkImageSizes = () => {
		if (imgFiles.length === 0 || imageDimensions.length === 0) {
			setImgWidth(0)
			setImgHeight(0)
			return true
		}

		if (imgFiles.length > 0) {
			const firstImageSize = `${imageDimensions[0]}`;
			const allSameSize = imageDimensions.every(dimension => dimension === firstImageSize);
			if (allSameSize) {
				const [width, heihgt] = firstImageSize.split('x').map(item => parseInt(item))
				setImgWidth(width)
				setImgHeight(heihgt)
			} else {
				setImgWidth(0)
				setImgHeight(0)
			}
			setAllImagesSameSize(allSameSize);
		} else {
			setAllImagesSameSize(false);
			setImgWidth(0)
			setImgHeight(0)
		}
	};

	useEffect(() => {
		checkImageSizes();
	}, [imgFiles, imageDimensions]);

	useEffect(() => {
		if (resizeEnabled && imgWidth && imgHeight && resizeWidth) {
			const aspectRatio = imgWidth / imgHeight;
			const calculatedHeight = Math.round(resizeWidth / aspectRatio);
			setResizeHeight(calculatedHeight);
		}
	}, [resizeEnabled, imgWidth, imgHeight, resizeWidth]);

	const handleCompress = () => {
		setCompressing(true)
		// 创建一个数组来存储压缩后的图片
		const compressedImages: string[] = [];
		const compressedSizes: number[] = [];

		// 遍历所有图片文件
		for (const imgFile of imgFiles) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target && e.target.result instanceof ArrayBuffer) {
					const uint8Arr = new Uint8Array(e.target.result);
					const inputWidth = resizeEnabled ? resizeWidth : undefined;
					const inputHeight = resizeEnabled ? resizeHeight : undefined;
					const ret = wasm.compress_with_resize(uint8Arr, uint8Arr.length, rate, inputWidth, inputHeight);

					const url = URL.createObjectURL(new Blob([ret], { type: 'image/jpeg' }));
					compressedImages.push(url);
					compressedSizes.push(ret.length);
				} else {
					console.error('读取文件失败');
				}

				// 当所有图片都处理完毕时，更新状态
				if (compressedImages.length === imgFiles.length) {
					setCompressedImgs(compressedImages);
					setCompressedSizes(compressedSizes);
					setCompressing(false)
				}
			};
			reader.readAsArrayBuffer(imgFile);
		}
	};

	const reselect = () => {
		const imgInput = document.querySelector('#image-upload-input') as HTMLInputElement
    imgInput && imgInput.click()
	};

	const resetStates = () => {
		setResizeEnabled(false);
		setResizeWidth(0);
		setResizeHeight(0);
		setImageFiles([]);
		setImgWidth(0)
		setImgHeight(0)
		setImageDimensions([]);
		setCompressedImgs([]);
		setCompressedSizes([]);
		setAllImagesSameSize(false);
	}

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// 重置状态
		resetStates()

		const target = event.target as HTMLInputElement;
		if (target.files) {
			const files = Array.from(target.files);
			setImageFiles(files);

			// 设置 imageDimensions
			const dimensions = files.map(file => {
				return new Promise<string>((resolve) => {
					const img = new Image();
					img.onload = () => {
						resolve(`${img.width} x ${img.height}`);
					};
					img.src = URL.createObjectURL(file);
				});
			});
			Promise.all(dimensions).then(resolvedDimensions => {
				setImageDimensions(resolvedDimensions);
			});
		}
	};

	const handleDelete = (index: number) => {
		const newImageFiles = [...imgFiles];
		newImageFiles.splice(index, 1);
		setImageFiles(newImageFiles);

		// 如果删除后没有图片了，重置所有状态
		if (newImageFiles.length === 0) {
			setResizeEnabled(false);
			setResizeWidth(0);
			setResizeHeight(0);
			setImgWidth(0);
			setImgHeight(0);
			setCompressedImgs([]);
			setCompressedSizes([]);
			setAllImagesSameSize(false);
			setImageDimensions([])
			return
		}

		if (compressedImgs) {
			const newCompressedImgs = [...compressedImgs];
			newCompressedImgs.splice(index, 1);
			setCompressedImgs(newCompressedImgs);
		}
		if (compressedSizes) {
			const newCompressedSizes = [...compressedSizes];
			newCompressedSizes.splice(index, 1);
			setCompressedSizes(newCompressedSizes);
		}
		const newImageDimensions = [...imageDimensions];
		newImageDimensions.splice(index, 1);
		setImageDimensions(newImageDimensions);
	};

	const handleReset = () => {
		setCompressedImgs([])
		setCompressedSizes([])
	}

	const handleDownloadAll = useCallback(() => {
		if (!compressedImgs) {
			console.error('没有压缩后的图片可供下载');
			return;
		}

		// 创建一个临时的 <a> 元素来触发下载
		const link = document.createElement('a');
		link.style.display = 'none';
		document.body.appendChild(link);

		// 为每个压缩后的图片创建下载链接
		compressedImgs.forEach((img, index) => {
			link.href = img;
			link.target = '_blank';
			link.download = `compressed_${imgFiles[index].name}.jpg`;
			link.click();
		});

		document.body.removeChild(link);
	}, [compressedImgs]);

	const resizedDimension = resizeEnabled && compressedImgs.length > 0 ? `${resizeWidth} x ${resizeHeight}` : null

	return (
		<div className="multiple-compress">
			<ImgSelector multiple={true} hidden={imgFiles && imgFiles.length > 0} onChange={onFileChange} />
			<div className="multiple-compress-process">
				{imgFiles && imgFiles.length > 0 && (
					<>
						<div className="img-process">
							<CompressSetting
								rate={rate}
								compressing={compressing}
								setRate={setRate}
								imgWidth={imgWidth}
								imgHeight={imgHeight}
								showResizeOpt={allImagesSameSize}
								resizeEnabled={allImagesSameSize ? resizeEnabled : false}
								setResizeEnabled={allImagesSameSize ? setResizeEnabled : undefined}
								resizeWidth={allImagesSameSize ? resizeWidth || imgWidth : undefined}
								setResizeWidth={allImagesSameSize ? setResizeWidth : undefined}
								resizeHeight={allImagesSameSize ? resizeHeight || imgHeight : undefined}
								handleCompress={handleCompress}
								reselect={reselect}
							/>
							{compressedImgs.length > 0 && (<div className="compressed-info">
								<div className="img-compress-btns">
									<Button raised className="mdc-theme--secondary-bg" onClick={handleDownloadAll}>
										全部下载
									</Button>
									<Button onClick={handleReset}>撤销</Button>
								</div>
							</div>)}
						</div>
						<ImgList
							imgFiles={imgFiles} 
							resizedDimension={resizedDimension}
							compressedImgs={compressedImgs}
							compressedSizes={compressedSizes}
							imageDimensions={imageDimensions}
							handleDelete={handleDelete}
							showDimension={!allImagesSameSize}
						/>
					</>
				)}
			</div>
		</div>
	);
}

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { ErrorMessage, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import NewsService from '../../../helpers/services/website-news.service';
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';
import { ApplicationState } from '../../redux';
import { Row } from 'react-bootstrap';
import ImagesService from '../../../helpers/services/website-images.service';
import history from '../../../helpers/history';
import { TINY_CLOUD_API_KEY } from '../../../helpers/config';
import { Editor } from '@tinymce/tinymce-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'react-toastify';

const WebsiteImageform: React.FC = () => {
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const location = useLocation<any>();
  const [filepath, setfilepath] = useState<any>({});
  const [image, setImage] = React.useState<any>({ files: null });
  const [newImageHtmlText, setNewImageHtmlText] = useState('');
  const [initialValues, setInitialvalues] = useState({
    imageName: '',
    imageHeader: '',
    imageHtmlText: '',
    isShowPublic: true,
    isActive: true,
    createdBy: ReduxLoginInfo.Admin.login.entities.createdBy,
    lastModifiedBy: ReduxLoginInfo.Admin.login.entities.lastModifiedBy,
  });
  const [yourFileName, setyourFileName] = useState<any>('image.png');
  const [upImg, setUpImg] = useState<any>();
  const imgRef = useRef<any>(null);
  const previewCanvasRef = useRef<any>(null);
  const [crop, setCrop] = useState<any>({
    unit: '%',
    width: 30,
    aspect: 2 / 1,
  });
  const [completedCrop, setCompletedCrop] = useState<any>(null);

  const validSchema = Yup.object().shape({
    imageName: Yup.string().required('required'),
    imageHeader: Yup.string().required('required'),
    imageHtmlText: Yup.string()
      .required('required')
      .max(1000, 'Maximum characters are 1000'),
    isShowPublic: Yup.boolean(),
  });

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setyourFileName(e.target.files[0].name);
      const reader = new FileReader();
      reader && reader.addEventListener('load', () => setUpImg(reader.result));
      reader && reader.readAsDataURL(e.target.files[0]);
    }
  };
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    canvas.toBlob((blob) => {
      const file = new File([blob], yourFileName);
      formik.setFieldValue('imageName', file);
    });
  }, [completedCrop]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await ImagesService.getoneImagesInfo(id);
      if (response) {
        let Data: any = response.data[0];
        setNewImageHtmlText(Data.imageHtmlText);
        setInitialvalues(Data);
        setfilepath(response.filepath);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      imageName: initialValues.imageName ? initialValues.imageName : '',
      imageHeader: initialValues.imageHeader ? initialValues.imageHeader : '',
      imageHtmlText: initialValues.imageHtmlText
        ? initialValues.imageHtmlText
        : '',
      isShowPublic: initialValues.isShowPublic
        ? initialValues.isShowPublic
        : '',
      isActive: initialValues.isActive ? initialValues.isActive : '',
      createdBy: initialValues.createdBy ? initialValues.createdBy : 0,
      lastModifiedBy: initialValues.lastModifiedBy
        ? initialValues.lastModifiedBy
        : 0,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (value: any) => {
      setInitialvalues(value);

      let response;
      if (location && location.state && location.state.id) {
        response = await ImagesService.updateImageInfo(
          value,
          location.state.id
        );
      } else {
        response = await ImagesService.postImageInfo(value);
      }
      if (response.status == 409) {
        toast.error(response.message, {
          position: toast.POSITION.TOP_CENTER,
          className: 'toast-message',
        });
      }
      if (response) {
        history.push('/imageList');
      }
    },
  });

  const newsshortHandler = (value, editor) => {
    setNewImageHtmlText(value);
    formik.setFieldValue('imageHtmlText', value);
  };

  return (
    <div className='content add-page'>
      <div className='card'>
        <div className='card-header'>
          <h1 className='cardtitlenew font-chng'>
            {location.state ? '' : 'Add Banner Image'}
            {location.state &&
              location.state.id &&
              location.state.view &&
              ' Banner Image'}
            {location.state &&
              location.state.id &&
              !location.state.view &&
              'Edit Banner Image'}
          </h1>
        </div>
        <div className='card-body'>
          <form name='WebsiteNewsform' onSubmit={formik.handleSubmit}>
            <>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label
                        htmlFor='imageHeader'
                        className='form-label required'
                      >
                        Header
                      </label>
                      <input
                        name='imageHeader'
                        value={formik.values.imageHeader}
                        onChange={formik.handleChange}
                        type='text'
                        className={
                          formik.errors.imageHeader &&
                          formik.touched.imageHeader
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.imageHeader
                          ? formik.errors.imageHeader
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-3' style={{ marginTop: '35px' }}>
                    <div className='form-grp'>
                      <label>
                        <input
                          type='checkbox'
                          name='isShowPublic'
                          onChange={(e) =>
                            formik.setFieldValue(
                              'isShowPublic',
                              !formik.values.isShowPublic
                            )
                          }
                          checked={formik.values.isShowPublic === true}
                          value='true'
                        />
                        {'   Show on Home page'}
                      </label>
                      <div className={'invalid-feedback'}>
                        {formik.errors.isShowPublic
                          ? formik.errors.isShowPublic
                          : ''}
                      </div>
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label
                        htmlFor='imageHtmlText'
                        className='form-label required'
                      >
                        Description
                      </label>
                      <Editor
                        init={{
                          plugins: 'link image code preview',
                          toolbar:
                            'undo redo | bold italic | alignleft aligncenter alignright | code',
                        }}
                        value={newImageHtmlText}
                        onEditorChange={newsshortHandler}
                        apiKey={TINY_CLOUD_API_KEY}
                        disabled={
                          location.state && location.state.view ? true : false
                        }
                      />{' '}
                      <div
                        className={'invalid-feedback'}
                        style={{ display: 'contents' }}
                      >
                        {formik.errors.imageHtmlText
                          ? formik.errors.imageHtmlText
                          : null}
                      </div>
                      {formik.values.imageHtmlText.length > 0 &&
                        formik.values.imageHtmlText.length <= 1000 &&
                        'Characters left: ' +
                          (1000 - formik.values.imageHtmlText.length)}
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label
                        htmlFor='imageName'
                        className='form-label required'
                      >
                        {' '}
                        Upload Image
                      </label>
                      <input
                        type='file'
                        name='imageName'
                        className={
                          formik.errors.imageName && formik.touched.imageName
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        // onChange={handleChangeImage}
                        onChange={onSelectFile}
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors.imageName
                          ? formik.errors.imageName
                          : null}
                      </div>
                    </div>
                    <ReactCrop
                      src={upImg}
                      onImageLoaded={onLoad}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                    />
                  </div>
                </Row>
              </fieldset>
            </>

            <div>
              <canvas
                ref={previewCanvasRef}
                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                style={{
                  width: Math.round(completedCrop?.width ?? 0),
                  height: Math.round(completedCrop?.height ?? 0),
                }}
              />
            </div>
            <div className={image && image.preview ? 'd-none' : ''}>
              {upImg == undefined && filepath && initialValues.imageName && (
                <img
                  alt=''
                  src={`${filepath}${initialValues.imageName}`}
                  width='320'
                  height='240'
                ></img>
              )}
            </div>
            <Row>
              <div className='form-grp buttongrouprightend mb-4'>
                <button
                  className='btn font-chng'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  onClick={() => history.push('/imageList')}
                >
                  Cancel
                </button>
                {location && location.state && location.state.view ? (
                  ''
                ) : (
                  <button
                    type='submit'
                    className='btn font-chng'
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                      textTransform: 'none',
                    }}
                  >
                    Submit
                  </button>
                )}
              </div>
            </Row>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebsiteImageform;

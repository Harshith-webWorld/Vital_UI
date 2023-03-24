import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Editor } from '@tinymce/tinymce-react';
import * as Yup from 'yup';
import NewsService from '../../../helpers/services/website-news.service';
import { ApplicationState } from '../../redux';
import { Row } from 'react-bootstrap';
import history from '../../../helpers/history';
import { TINY_CLOUD_API_KEY } from '../../../helpers/config';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const WebsiteNewsform: React.FC = () => {
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const [filepath, setfilepath] = useState<any>({});
  const [ifVideoContent, setIfVideoContent] = useState(false);
  const [hideLongDescription, setHideLongDescription] = useState(false);
  const [newsDescriptionShortHTML, setnewsDescriptionShortHTML] = useState('');
  const [newsDescriptionLongHTML, setnewsDescriptionLongHTML] = useState('');
  const location = useLocation<any>();
  const [image, setImage] = React.useState<any>({ files: null });
  const [video, setVideo] = React.useState<any>({ files: null });
  const [yourFileName, setyourFileName] = useState<any>('image.png');
  const [upImg, setUpImg] = useState<any>();
  const imgRef = useRef<any>(null);
  const previewCanvasRef = useRef<any>(null);
  const [crop, setCrop] = useState<any>({
    unit: '%',
    width: 30,
    aspect: 3 / 2,
  });
  const [completedCrop, setCompletedCrop] = useState<any>(null);

  const isVideoContent = (e) => {
    if (e.target.value === 'true') {
      setIfVideoContent(true);
      setHideLongDescription(false);
      formik.setFieldValue('newsDescriptionLongHTML', '');
    } else {
      setIfVideoContent(false);
    }
  };

  const IsPaperContent = (e) => {
    if (e.target.value === 'true') {
      formik.setFieldValue('newsDescriptionLongHTML', '');
      setHideLongDescription(true);
      setIfVideoContent(false);
    } else {
      setHideLongDescription(false);
    }
  };

  const [initialValues, setInitialvalues] = useState({
    newsHeader: '',
    newsDescriptionShortHTML: '',
    newsDescriptionLongHTML: '',
    newsImageName: '',
    newsVideoName: '',
    isVideoContent: false,
    isNewsPaperCutting: false,
    isShowPublic: true,
    isActive: true,
    createdBy: ReduxLoginInfo.Admin.login.entities.createdBy,
    lastModifiedBy: ReduxLoginInfo.Admin.login.entities.lastModifiedBy,
  });

  const validSchema = Yup.object().shape(
    {
      newsHeader: Yup.string().required('required'),
      newsDescriptionShortHTML: Yup.string()
        .required('required')
        .max(1000, 'Maximum characters are 1000'),
      newsDescriptionLongHTML: Yup.string().max(
        4000,
        'Maximum characters are 4000',
      ),
      newsImageName: Yup.string().when('newsVideoName', {
        is: (newsVideoName) => !newsVideoName || newsVideoName.length === 0,
        then: Yup.string().required('required'),
      }),
      newsVideoName: Yup.string().when('newsImageName', {
        is: (newsImageName) => !newsImageName || newsImageName.length === 0,
        then: Yup.string().required('required'),
      }),
      isShowPublic: Yup.boolean(),
    },
    [['newsVideoName', 'newsImageName']],
  );

  const newsshortHandler = (value, editor) => {
    setnewsDescriptionShortHTML(value);
    formik.setFieldValue('newsDescriptionShortHTML', value);
  };
  const newslongHandler = (value, editor) => {
    setnewsDescriptionLongHTML(value);
    formik.setFieldValue('newsDescriptionLongHTML', value);
  };
  const handleChangeImage = (e: any) => {
    if (e.target.value.length) {
      formik.setFieldValue('newsImageName', e.target.files);
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        files: e.target.files[0],
      });
    }
  };

  const handleChangeVideo = (e: any) => {
    if (e.target.value.length) {
      formik.setFieldValue('newsVideoName', e.target.files);
      setVideo({
        preview: URL.createObjectURL(e.target.files[0]),
        files: e.target.files[0],
      });
    }
  };
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
      crop.height * scaleY,
    );
    canvas.toBlob((blob) => {
      const file = new File([blob], yourFileName);
      formik.setFieldValue('newsImageName', file);
    });
  }, [completedCrop]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (location && location.state && location.state.id) {
      const response = await NewsService.getoneNewsInfo(location.state.id);
      if (response && response.data[0]) {
        setInitialvalues(response.data[0]);
        setnewsDescriptionShortHTML(response.data[0].newsDescriptionShortHTML);
        setnewsDescriptionLongHTML(response.data[0].newsDescriptionLongHTML);
        if (response.data[0].isVideoContent === true) {
          response.data[0].newsVideoName = response.data[0].newsImageName;
          response.data[0].newsImageName = null;
          setIfVideoContent(true);
          setHideLongDescription(false);
          formik.setFieldValue('newsVideoName', response.data[0].newsVideoName);
        } else if (response.data[0].IsNewsPaperCutting === true) {
          setIfVideoContent(false);
          setHideLongDescription(true);
          formik.setFieldValue('newsImageName', response.data[0].newsImageName);
        } else if (
          response.data[0].IsNewsPaperCutting === false &&
          response.data[0].isVideoContent === false
        ) {
          setIfVideoContent(false);
          setHideLongDescription(false);
          formik.setFieldValue('newsImageName', response.data[0].newsImageName);
        }
        setfilepath(response.filepath);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      newsHeader: initialValues.newsHeader ? initialValues.newsHeader : '',
      newsDescriptionShortHTML: initialValues.newsDescriptionShortHTML
        ? initialValues.newsDescriptionShortHTML
        : '',
      newsDescriptionLongHTML: initialValues.newsDescriptionLongHTML
        ? initialValues.newsDescriptionLongHTML
        : '',
      newsImageName: initialValues.newsImageName
        ? initialValues.newsImageName
        : '',
      newsVideoName: initialValues.newsVideoName
        ? initialValues.newsVideoName
        : '',
      isVideoContent: initialValues.isVideoContent
        ? initialValues.isVideoContent
        : '',
      isNewsPaperCutting: initialValues.isNewsPaperCutting
        ? initialValues.isNewsPaperCutting
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
    onSubmit: async (values: any) => {
      if (values.isVideoContent && video.files) {
        values.newsVideoName = video.files;
        values.newsImageName = null;
        values.newsDescriptionLongHTML = '';
        values.isVideoContent = true;
      }
      if (image.files) {
        values.newsImageName = image.files;
        values.newsVideoName = null;
        values.isVideoContent = false;
      }

      setInitialvalues(values);
      let response;
      if (location && location.state && location.state.id) {
        response = await NewsService.updateNews(values, location.state.id);
      } else {
        response = await NewsService.postNews(values);
      }
      if (response) {
        history.push('/newsList');
      }
    },
  });

  return (
    <div className='content add-page'>
      <div className='card'>
        <div className='card-header'>
          <h1 className='cardtitlenew'>
            {' '}
            {location.state ? '' : 'Add Latest News'}
            {location.state &&
              location.state.id &&
              location.state.view &&
              ' Latest News'}
            {location.state &&
              location.state.id &&
              !location.state.view &&
              'Edit Latest News'}
          </h1>
        </div>
        <div className='card-body'>
          <form
            name='WebsiteNewsform'
            onSubmit={formik.handleSubmit}
            onChange={formik.handleChange}>
            <>
              <fieldset
                disabled={location.state && location.state.view ? true : false}>
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label
                        htmlFor='newsHeader'
                        className='form-label required'>
                        Header
                      </label>
                      <input
                        name='newsHeader'
                        value={formik.values.newsHeader}
                        type='text'
                        className={
                          formik.errors.newsHeader && formik.touched.newsHeader
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.newsHeader
                          ? formik.errors.newsHeader
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
                              !formik.values.isShowPublic,
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
                  </div>{' '}
                </Row>
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label
                        htmlFor='newsDescriptionShortHTML'
                        className='form-label required'>
                        Short Description
                      </label>
                      <Editor
                        // id="inputText"
                        // name="newsDescriptionShortHTML"
                        init={{
                          plugins: 'link image code preview',
                          toolbar:
                            'undo redo | bold italic | alignleft aligncenter alignright | code',
                        }}
                        value={newsDescriptionShortHTML}
                        onEditorChange={newsshortHandler}
                        apiKey={TINY_CLOUD_API_KEY}
                        disabled={
                          location.state && location.state.view ? true : false
                        }
                      />
                      <div
                        className={'invalid-feedback'}
                        style={{ display: 'contents' }}>
                        {formik.errors.newsDescriptionShortHTML
                          ? formik.errors.newsDescriptionShortHTML
                          : null}
                      </div>
                      {formik.values.newsDescriptionShortHTML.length > 0 &&
                        formik.values.newsDescriptionShortHTML.length <= 1000 &&
                        'Characters left: ' +
                          (1000 -
                            formik.values.newsDescriptionShortHTML.length)}
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label
                        htmlFor='isVideoContent'
                        className='form-label required'>
                        Do you upload video content?{' '}
                      </label>
                      <div className='form-radio'>
                        <label className='form-label'>
                          <input
                            name='isVideoContent'
                            type='radio'
                            value='true'
                            onChange={(e) => isVideoContent(e)}
                            checked={ifVideoContent === true}
                          />
                          <label className='form-label'>Yes</label>
                        </label>
                        <label className='form-label'>
                          <input
                            name='isVideoContent'
                            type='radio'
                            onChange={(e) => isVideoContent(e)}
                            checked={ifVideoContent === false}
                            value='false'
                          />
                          <label className='form-label'>No</label>
                        </label>
                      </div>
                    </div>
                  </div>
                </Row>
                {!ifVideoContent && (
                  <Row>
                    <div className='col-md-9'>
                      <div className='form-grp'>
                        <label
                          htmlFor='isNewsPaperCutting'
                          className='form-label required'>
                          Do you upload paper content?
                        </label>
                        <div className='form-radio'>
                          <label className='form-label'>
                            <input
                              name='isNewsPaperCutting'
                              type='radio'
                              onChange={(e) => IsPaperContent(e)}
                              checked={hideLongDescription === true}
                              value='true'
                            />
                            <label className='form-label'>Yes</label>
                          </label>
                          <label className='form-label'>
                            <input
                              name='isNewsPaperCutting'
                              type='radio'
                              onChange={(e) => IsPaperContent(e)}
                              checked={hideLongDescription === false}
                              value='false'
                            />
                            <label className='form-label'>No</label>
                          </label>
                        </div>
                      </div>
                    </div>
                  </Row>
                )}

                {!ifVideoContent && !hideLongDescription && (
                  <div>
                    <Row>
                      <div className='col-md-9'>
                        <div className='form-grp'>
                          <label
                            htmlFor='newsDescriptionLongHTML'
                            className='form-label required'>
                            Long Description
                          </label>
                          <Editor
                            init={{
                              plugins: 'link image code preview',
                              toolbar:
                                'undo redo | bold italic | alignleft aligncenter alignright | code',
                            }}
                            onEditorChange={newslongHandler}
                            value={newsDescriptionLongHTML}
                            apiKey='8jeqhvqs1jqap8etksc28rytmtriu9mqt98kfbdwf2elsj0n'
                            disabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                          />
                          <div
                            className={'invalid-feedback'}
                            style={{ display: 'contents' }}>
                            {formik.errors.newsDescriptionLongHTML
                              ? formik.errors.newsDescriptionLongHTML
                              : null}
                          </div>
                          {formik.values.newsDescriptionLongHTML.length > 0 &&
                            formik.values.newsDescriptionLongHTML.length <=
                              4000 &&
                            'Characters left: ' +
                              (4000 -
                                formik.values.newsDescriptionLongHTML.length)}
                        </div>
                      </div>
                    </Row>
                  </div>
                )}

                {!ifVideoContent ? (
                  <div>
                    <Row>
                      <div className='col-md-9'>
                        <div className='form-grp'>
                          <label htmlFor='newsImageName' className='form-label'>
                            Upload Image
                          </label>
                          <input
                            type='file'
                            name={'newsImageName'}
                            //value={formik.values.newsImageName}
                            className={
                              formik.errors.newsImageName &&
                              formik.touched.newsImageName
                                ? 'form-control is-invalid'
                                : 'form-control'
                            }
                            // onChange={handleChangeImage}
                            onChange={onSelectFile}></input>
                          <div className={'invalid-feedback'}>
                            {formik.errors.newsImageName
                              ? formik.errors.newsImageName
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
                  </div>
                ) : (
                  <Row>
                    <div className='col-md-9'>
                      <div className='form-grp'>
                        <label htmlFor='newsVideoName' className='form-label'>
                          Upload Video
                        </label>
                        <input
                          type='file'
                          name='newsVideoName'
                          // value={initialValues.newsVideoName ? initialValues.newsVideoName : ""}
                          className={
                            formik.errors.newsVideoName &&
                            formik.touched.newsVideoName
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          onChange={handleChangeVideo}></input>
                        <div className={'invalid-feedback'}>
                          {formik.errors.newsVideoName
                            ? formik.errors.newsVideoName
                            : null}
                        </div>
                      </div>
                    </div>
                  </Row>
                )}
                {!ifVideoContent && (
                  <div>
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
                      {upImg == undefined &&
                        filepath &&
                        initialValues.newsImageName && (
                          <img
                            src={`${filepath}${initialValues.newsImageName}`}
                            width='320'
                            height='240'
                          />
                        )}
                    </div>
                  </div>
                )}
                {ifVideoContent && (
                  <div>
                    {video.preview && (
                      <video src={video.preview} width='320' height='240' />
                    )}
                    {filepath && initialValues.newsVideoName && (
                      <video
                        src={`${filepath}${initialValues.newsVideoName}`}
                        width='320'
                        height='240'
                      />
                    )}
                  </div>
                )}
              </fieldset>
            </>
            <br></br>
            <Row>
            <div className="form-grp buttongrouprightend mb-4">
                <button
                  className="btn font-chng"
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  onClick={() => history.push('/newsList')}>
                  Cancel
                </button>
                {location && location.state && location.state.view ? (
                  ''
                ) : (
                  <button type='submit'className="btn font-chng"
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}>
                    Submit
                  </button>
                )}
              </div>
            </Row>
            <br></br>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebsiteNewsform;

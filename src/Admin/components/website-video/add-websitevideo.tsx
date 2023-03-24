import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Row } from 'react-bootstrap';
import VideoServices from '../../../helpers/services/website-videos.service';
import { ApplicationState } from '../../redux';
import history from '../../../helpers/history';
import { BASE_URL } from '../../../helpers/config';
import { Editor } from '@tinymce/tinymce-react';
import { TINY_CLOUD_API_KEY } from '../../../helpers/config';

const WebsiteVideoform: React.FC = () => {
  const location = useLocation<any>();
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const [video, setvideo] = React.useState<any>({ files: null });
  const [formdata, setformdata] = useState<any>({
    videoName: '',
    videoHeader: '',
    videoHtmlText: '',
    isActive: '',
    isShowPublic: true,
  });
  const [filepath, setfilepath] = useState<any>('');
  const [mtsType, setmtsType] = useState<any>(null);
  const [videoHtmlText, setvideoHtmlText] = useState('');

  useEffect(() => {
    getEditData();
  }, []);

  async function getEditData() {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await VideoServices.getOneVideoInfo(id);
      if (response) {
        let arr: any = response.data[0];
        let path: any = response.filepath;
        setformdata(arr);
        setfilepath(`${BASE_URL}/websitecontent-videos/videos/`);
        // setvideoHtmlText(arr.videoHtmlText)
      }
    }
  }

  function getVideoCover(file, seekTo = 0.0): any {
    return new Promise((resolve, reject) => {
      // load the file to a video player
      const videoPlayer = document.createElement('video');
      videoPlayer.setAttribute('src', URL.createObjectURL(file));
      videoPlayer.load();
      videoPlayer.addEventListener('error', (ex) => {
        reject(ex);
      });
      // load metadata of the video to get video duration and dimensions
      videoPlayer.addEventListener('loadedmetadata', () => {
        // seek to user defined timestamp (in seconds) if possible
        if (videoPlayer.duration < seekTo) {
          reject(null);
          return;
        }
        // delay seeking or else 'seeked' event won't fire on Safari
        setTimeout(() => {
          videoPlayer.currentTime = seekTo;
        }, 200);
        // extract video thumbnail once seeking is complete
        videoPlayer.addEventListener('seeked', () => {
          // define a canvas to have the same dimension as the video
          const canvas = document.createElement("canvas");
          canvas.width = videoPlayer.videoWidth;
          canvas.height = videoPlayer.videoHeight;
          // draw the video frame to canvas
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          // return the canvas image as a blob
          ctx.canvas.toBlob(
            blob => {
              resolve(blob);
            },
            "image/jpeg",
            0.75 /* quality */
          );
        });
      });
    });
  }

  const handleChangeVideo = (e: any) => {
    if (e.target.value.length) {
      let fileList = e.target.files;
      let file = fileList[0];
      let extension = file.name.split('.').pop();
      if (extension === 'mts') {
        e.target.value = null;
        formik.setFieldValue('videoName', null);
        setmtsType('MTS File not support');
      } else {
        setmtsType(null);
        formik.setFieldValue('videoName', e.target.files);
        setvideo({
          preview: URL.createObjectURL(e.target.files[0]),
          files: e.target.files[0],
        });
      }
    }
  };

  const validationSchema = Yup.object().shape({
    videoHeader: Yup.string().required('required'),
    videoHtmlText: Yup.string()
      .required('required')
      .max(1000, 'Maximum characters are 1000'),
    videoName: Yup.string().required('required'),
    isShowPublic: Yup.boolean(),
  });

  const DescriptionHandler = (value, editor: any) => {
    setvideoHtmlText(value);
    formik.setFieldValue('videoHtmlText', value);
  };

  const formik = useFormik({
    initialValues: {
      videoHeader: formdata && formdata.videoHeader ? formdata.videoHeader : '',
      videoHtmlText:
        formdata && formdata.videoHtmlText ? formdata.videoHtmlText : '',
      videoName: formdata && formdata.videoName ? formdata.videoName : '',
      isActive: true,
      isShowPublic:
        formdata && formdata.isShowPublic ? formdata.isShowPublic : '',
      createdBy: 1, //ReduxLoginInfo.Admin.login.entities.createdBy
      lastModifiedBy: 1, //ReduxLoginInfo.Admin.login.entities.lastModifiedBy
    },
    enableReinitialize: true,
    validationSchema: validationSchema,

    onSubmit: async (values: any) => {
      values.videoName = video.files;
      let thumbBlob = await getVideoCover(video.files)
      if (thumbBlob) {
        let thumbFile = new File([thumbBlob], "thumb.jpg", { type: thumbBlob.type });
        values.thumbnail = thumbFile;
      }
      if (location.state && location.state && location.state.id) {
        const id: any = location.state.id;
        const response = await VideoServices.editVideoInfo(id, values);
        history.push('/videoList');
      } else {
        let response = await VideoServices.createVideoInfo(values);
        history.push('/videoList');
      }
    },
  });

  return (
    <div className='content add-page'>
      <div className='card '>
        <div className='card-header'>
          <h5 className='cardtitlenew'>
            {location.state ? '' : 'Add Videos'}
            {location.state &&
              location.state.id &&
              location.state.view &&
              'Videos'}
            {location.state &&
              location.state.id &&
              !location.state.view &&
              'Edit Videos'}{' '}
          </h5>
        </div>
        <div className='card-body'>
          <form onSubmit={formik.handleSubmit}>
            <fieldset
              disabled={location.state && location.state.view ? true : false}>
              <Row>
                {' '}
                <div className='col-md-9'>
                  <div className='form-grp'>
                    <label
                      htmlFor='videoHeader'
                      className='form-label required'>
                      Header
                    </label>
                    <input
                      name='videoHeader'
                      type='text'
                      value={formik.values.videoHeader}
                      onChange={formik.handleChange}
                      className={
                        formik.errors.videoHeader && formik.touched.videoHeader
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    <div className={'invalid-feedback'}>
                      {formik.errors.videoHeader
                        ? formik.errors.videoHeader
                        : null}
                    </div>
                  </div>
                </div>{' '}
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
              </Row>{' '}
              <div className='form-grp'>
                <div className='col-md-9'>
                  <label className='form-label required'>Description </label>
                  <Editor
                    // id="inputText"
                    // name="videoHtmlText"
                    init={{
                      plugins: 'link image code preview',
                      toolbar:
                        'undo redo | bold italic | alignleft aligncenter alignright | code',
                    }}
                    value={formik.values.videoHtmlText}
                    onEditorChange={DescriptionHandler}
                    apiKey={TINY_CLOUD_API_KEY}
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  />
                  <div
                    className={'invalid-feedback'}
                    style={{ display: 'contents' }}>
                    {formik.errors.videoHtmlText
                      ? formik.errors.videoHtmlText
                      : null}
                  </div>
                  {formik.values.videoHtmlText.length > 0 &&
                    formik.values.videoHtmlText.length <= 1000 &&
                    'Characters left: ' +
                    (1000 - formik.values.videoHtmlText.length)}
                </div>
              </div>
              <Row>
                <div className='form-grp'>
                  <div className='col-md-9'>
                    <label className='form-label required'>Upload Video</label>
                    <input
                      type='file'
                      name='videoName'
                      className={
                        formik.errors.videoName && formik.touched.videoName
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                      onChange={handleChangeVideo}
                    />
                    <div className={'invalid-feedback'}>
                      {formik.errors.videoName ? formik.errors.videoName : null}
                    </div>
                  </div>
                </div>
              </Row>
              {mtsType && (
                <label className='text-danger'>
                  {mtsType ? mtsType : null}
                </label>
              )}
              {!mtsType && (
                <div>
                  {video.preview && (
                    <video
                      width='320'
                      height='240'
                      src={video.preview}
                      controls></video>
                  )}
                </div>
              )}
              <div className={video && video.preview ? 'd-none' : ''}>
                {filepath && (
                  <video
                    width='320'
                    height='240'
                    src={`${filepath}${formdata.videoName}`}
                    controls></video>
                )}
              </div>{' '}
            </fieldset>

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
                // style={
                //   location.state && location.state.view ? { color: '#000' } : {}
                // }
                onClick={() => history.push('/videoList')}>
                Cancel
              </button>
              {location && location.state && location.state.view ? (
                ''
              ) : (
                <button type='submit'  
                className="btn font-chng"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebsiteVideoform;

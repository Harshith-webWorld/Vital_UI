/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from '@tinymce/tinymce-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select, { Option } from 'react-select';
import ProgramInfoServices from '../../../helpers/services/website-programInfos.service';
import { ApplicationState } from '../../redux';
import history from '../../../helpers/history';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import moment from 'moment';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import { StepIconProps } from '@material-ui/core/StepIcon';
import {
  ProgramInfoSection,
  ProgramInfoLinks,
} from '../../../helpers/interfaces/programInfoInterface';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import plusImg from '../../assets/images/add_new.png';
import DataTable from 'react-data-table-component';
import viewIcon from '../../../Admin/assets/images/view_icon.png';
import editIcon from '../../../Admin/assets/images/Edit_icon.png';
import deleteIcon from '../../../Admin/assets/images/delete_icon.png';
import { TINY_CLOUD_API_KEY } from '../../../helpers/config';
import { BASE_URL } from '../../../helpers/config';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const WebsiteprogramInfosform: React.FC = () => {
  const location = useLocation<any>();
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const [yourFileName, setyourFileName] = useState<any>('image.png');
  const [upImg, setUpImg] = useState<any>();
  const imgRef = useRef<any>(null);
  const previewCanvasRef = useRef<any>(null);
  const [crop, setCrop] = useState<any>({
    unit: '%',
    width: 30,
    aspect: 1.7 / 1,
  });
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [image, setImage] = React.useState<any>({ files: null });
  const [formdata, setformdata] = useState<any>();
  const [filepath, setfilepath] = useState<any>('');
  const [programInfoFilepath, setProgramInfoFilepath] = useState<any>('');
  const [Link, setLink] = React.useState<any>({ files: null });
  const [activeStep, setActiveStep] = React.useState(0);
  const [hideSection, setHideSection] = useState(true);
  const [hideSectionLink, setHideSectionLink] = useState(true);
  const [sectionData, setSectionData] = useState([]);
  const [linkData, setLinkData] = useState([]);
  const [programInfoDescriptionShortHTML, setprogramInfoDescriptionShortHTML] =
    useState('');
  const [programInfoDescriptionLongHTML, setprogramInfoDescriptionLongHTML] =
    useState('');
  const [sectionInfo, setSectionInfo] = useState<ProgramInfoSection>({
    programInfoId: 0,
    displayOrder: '',
    programInfoSectionName: '',
    isActive: true,
    createdBy:
      ReduxLoginInfo &&
      ReduxLoginInfo.Admin &&
      ReduxLoginInfo.Admin.login &&
      ReduxLoginInfo.Admin.login.entities &&
      ReduxLoginInfo.Admin.login.entities.createdBy,
    lastModifiedBy:
      ReduxLoginInfo &&
      ReduxLoginInfo.Admin &&
      ReduxLoginInfo.Admin.login &&
      ReduxLoginInfo.Admin.login.entities &&
      ReduxLoginInfo.Admin.login.entities.lastModifiedBy,
  });
  const [sectionInitialInfo, setSectionInitialInfo] =
    useState<ProgramInfoSection>({
      programInfoId: 0,
      displayOrder: '',
      programInfoSectionName: '',
      isActive: true,
      createdBy: 0,
      lastModifiedBy: 0,
    });
  const [linksInitialInfo, setLinksInitialInfo] = useState<ProgramInfoLinks>({
    programInfoId: 0,
    programInfoSectionId: '',
    linkName: '',
    displayOrder: '',
    linkFileName: '',
    linkFileType: '',
    isActive: true,
    createdBy: 0,
    lastModifiedBy: 0,
  });
  let linkfileValues = [
    { label: 'pdf', value: 'pdf' },
    { label: 'image', value: 'image' },
    { label: 'audio', value: 'audio' },
    { label: 'video', value: 'video' },
  ];
  const [linksInfo, setLinksInfo] = useState<ProgramInfoLinks>({
    programInfoId: 0,
    programInfoSectionId: '',
    linkName: '',
    displayOrder: '',
    linkFileName: '',
    linkFileType: '',
    isActive: true,
    createdBy:
      ReduxLoginInfo &&
      ReduxLoginInfo.Admin.login &&
      ReduxLoginInfo.Admin.login.entities &&
      ReduxLoginInfo.Admin.login.entities.createdBy,
    lastModifiedBy:
      ReduxLoginInfo &&
      ReduxLoginInfo.Admin.login &&
      ReduxLoginInfo.Admin.login.entities &&
      ReduxLoginInfo.Admin.login.entities.lastModifiedBy,
  });

  useEffect(() => {
    getProgramInfoData();
    getAllProgramInfoSection();
    getAllProgramInfoSectionLink();
  }, []);

  async function getProgramInfoData() {
    if (location && location.state && location.state.id) {
      const response = await ProgramInfoServices.getOneProgramInfo(
        location.state.id,
      );
      if (response) {
        setformdata(response.data[0]);
        setprogramInfoDescriptionShortHTML(
          response.data[0].programInfoDescriptionShortHTML,
        );
        setprogramInfoDescriptionLongHTML(
          response.data[0].programInfoDescriptionLongHTML,
        );
        setProgramInfoFilepath(
          `${BASE_URL}/websitecontent-programinfos/blogs/`,
        );
      }
    }
  }

  const handleChangeImage = (e: any) => {
    if (e.target.value.length) {
      formik.setFieldValue('programInfoImage', e.target.files);
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        files: e.target.files[0],
      });
    }
  };
  const handleChangeLinks = (e: any) => {
    if (e.target.value.length) {
      formik.setFieldValue('linkFileName', e.target.files);
      setLink({
        preview: URL.createObjectURL(e.target.files[0]),
        files: e.target.files[0],
      });
    }
  };
  const getOneSectionInfo = async (row) => {
    setHideSection(false);
    setSectionInfo({ sectionInfo, ...row });
  };

  const getOneSectionLinkInfo = async (row) => {
    setHideSectionLink(false);
    setLinksInfo({ linksInfo, ...row });
  };

  const getAllProgramInfoSection = async () => {
    let programInfosId;
    if (location && location.state && location.state.id) {
      programInfosId = location.state.id;
    } else {
      programInfosId = sectionInfo.programInfoId;
    }
    const response = await ProgramInfoServices.getProgramSectionList(
      programInfosId,
    );
    if ((response && response.data) || response.message == 'EMPTY') {
      setHideSection(true);
      setSectionData(response.data);
    }
  };

  const getAllProgramInfoSectionLink = async () => {
    let programInfoId;
    if (location && location.state && location.state.id) {
      programInfoId = location.state.id;
    } else {
      programInfoId = sectionInfo.programInfoId;
    }
    const response = await ProgramInfoServices.getProgramInfoSectionLinkList(
      programInfoId,
    );
    if ((response && response.data) || response.message == 'EMPTY') {
      setLinkData(response.data);
      setfilepath(`${BASE_URL}/websitecontent-programinfos/programInfoLinks/`);
      setHideSectionLink(true);
    }
  };

  const ProgramInfoshortHandler = (value, editor) => {
    setprogramInfoDescriptionShortHTML(value);
    formik.setFieldValue('programInfoDescriptionShortHTML', value);
  };
  const ProgramInfolongHandler = (value, editor) => {
    setprogramInfoDescriptionLongHTML(value);
    formik.setFieldValue('programInfoDescriptionLongHTML', value);
  };

  async function deleteSection(row) {
    const deleteResult: any =
      await ProgramInfoServices.deleteProgramInfoSection(row.id);
    if (deleteResult.status === 200) {
      getAllProgramInfoSection();
    }
  }

  async function deleteLink(row) {
    const deleteResult: any = await ProgramInfoServices.deleteProgramInfoLink(
      row.id,
    );
    if (deleteResult.status === 200) {
      getAllProgramInfoSectionLink();
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    getProgramInfoData();
    getAllProgramInfoSection();
    getAllProgramInfoSectionLink();
  };
  const hideSections = (id: any) => {
    Sectionformik.resetForm({ values: sectionInitialInfo });
    setLink({ files: null, preview: '' });
    setLinksInfo(linksInitialInfo);
    setHideSection(false);
  };

  const hideSectionsLink = (id: any) => {
    Linksformik.resetForm({ values: linksInitialInfo });
    setLinksInfo(linksInitialInfo);
    setLink({ files: null, preview: '' });
    setHideSectionLink(false);
  };

  function MoveProgramInfoListPage() {
    history.push('/programInfosList');
  }

  const columns1 = [
    {
      name: 'Section Name',
      selector: 'programInfoSectionName',
    },
    {
      name: 'Display Order',
      selector: 'displayOrder',
    },
    {
      name: 'Date Of Submission',
      selector: (row: any) => <div>{moment(row.createdAt).format('L')}</div>,
    },
    {
      name: 'Last Modified',
      selector: (row: any) => <div>{moment(row.updatedAt).format('L')}</div>,
    },
    {
      name: 'Actions',
      selector: 'Actions',
      cell: (row) => (
        <div data-tag='allowRowEvents'>
          <button className='btn' onClick={() => getOneSectionInfo(row)}>
            <img src={viewIcon} />
          </button>
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button onClick={() => getOneSectionInfo(row)} className='btn'>
                <img src={editIcon} />
              </button>
              <button onClick={() => deleteSection(row)} className='btn'>
                <img src={deleteIcon} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const columns2 = [
    {
      name: 'Link Name',
      selector: 'linkName',
    },
    {
      name: 'Section Name',
      selector: (row: any) =>
        row.websiteContentProgramInfoSection &&
          row.websiteContentProgramInfoSection.programInfoSectionName
          ? row.websiteContentProgramInfoSection.programInfoSectionName
          : '',
    },
    {
      name: 'Link File Type',
      selector: 'linkFileType',
    },
    {
      name: 'Display Order',
      selector: 'displayOrder',
    },
    {
      name: 'Date Of Submission',
      selector: (row: any) => <div>{moment(row.createdAt).format('L')}</div>,
    },
    {
      name: 'Last Modified',
      selector: (row: any) => <div>{moment(row.updatedAt).format('L')}</div>,
    },

    {
      name: 'Actions',
      selector: 'Actions',
      cell: (row) => (
        <div data-tag='allowRowEvents'>
          <button className='btn' onClick={() => getOneSectionLinkInfo(row)}>
            <img src={viewIcon} />
          </button>
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button
                onClick={() => getOneSectionLinkInfo(row)}
                className='btn'>
                <img src={editIcon} />
              </button>
              <button onClick={() => deleteLink(row)} className='btn'>
                <img src={deleteIcon} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const validationSchema = Yup.object().shape({
    programInfoHeader: Yup.string().required('required'),
    programInfoDescriptionShortHTML: Yup.string()
      .required('required')
      .max(1000, 'Maximum characters are 1000'),

    programInfoDescriptionLongHTML: Yup.string()
      .required('required')
      .max(4000, 'Maximum characters are 4000'),

    programInfoImage: Yup.string().required('required'),
  });
  const sectionValidationSchema = Yup.object().shape({
    programInfoSectionName: Yup.string().required('required').nullable(),
    displayOrder: Yup.number().required('required').nullable(),
  });

  const linkValidationSchema = Yup.object().shape({
    // programInfoSectionId: Yup.string().required("required").nullable(),
    displayOrder: Yup.number().required('required').nullable(),
    linkName: Yup.string().required('required').nullable(),
    linkFileName: Yup.string().required('required').nullable(),
    linkFileType: Yup.string().required('required').nullable(),
  });

  const formik = useFormik({
    initialValues: {
      programInfoHeader:
        formdata && formdata.programInfoHeader
          ? formdata.programInfoHeader
          : '',
      programInfoDescriptionShortHTML:
        formdata && formdata.programInfoDescriptionShortHTML
          ? formdata.programInfoDescriptionShortHTML
          : '',
      programInfoDescriptionLongHTML:
        formdata && formdata.programInfoDescriptionLongHTML
          ? formdata.programInfoDescriptionLongHTML
          : '',
      programInfoImage:
        formdata && formdata.programInfoImage ? formdata.programInfoImage : '',
      isActive: true,
      createdBy:
        ReduxLoginInfo &&
        ReduxLoginInfo.Admin.login &&
        ReduxLoginInfo.Admin.login.entities &&
        ReduxLoginInfo.Admin.login.entities.createdBy,
      lastModifiedBy:
        ReduxLoginInfo &&
        ReduxLoginInfo.Admin.login &&
        ReduxLoginInfo.Admin.login.entities &&
        ReduxLoginInfo.Admin.login.entities.lastModifiedBy,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,

    onSubmit: async (values: any) => {
      // values.programInfoImage = image.files;
      if (
        location.state &&
        location.state.view &&
        formik.values.programInfoHeader !== 'Important Indicators'
      ) {
        handleNext();
      } else {
        if (location.state && location.state.id) {
          const id: any = location.state.id;
          const response = await ProgramInfoServices.editProgramInfosInfo(
            id,
            values,
          );
          setSectionInfo({ ...sectionInfo, programInfoId: response.data.id });
          formik.values.programInfoHeader !== 'Important Indicators'
            ? handleNext()
            : history.push('/programInfosList');
        } else {
          let response = await ProgramInfoServices.createProgramInfosInfo(
            values,
          );
          setSectionInfo({ ...sectionInfo, programInfoId: response.data.id });
          formik.values.programInfoHeader !== 'Important Indicators'
            ? handleNext()
            : history.push('/programInfosList');
        }
      }
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const Sectionformik = useFormik({
    initialValues: sectionInfo,
    enableReinitialize: true,
    validationSchema: sectionValidationSchema,

    onSubmit: async (values: any) => {
      if (location && location.state && location.state.view) {
        setHideSection(true);
        getAllProgramInfoSection();
      } else {
        if (location && location.state && location.state.id) {
          values.programInfoId = location.state.id;
        } else {
          values.programInfoId = sectionInfo.programInfoId;
        }
        let response = await ProgramInfoServices.createProgramInfosInfoSection(
          values,
        );
        setLinksInfo({ ...linksInfo, programInfoSectionId: response.data.id });
        setHideSection(true);
        getAllProgramInfoSection();
      }
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const Linksformik = useFormik({
    initialValues: linksInfo,
    enableReinitialize: true,
    validationSchema: linkValidationSchema,

    onSubmit: async (values: any) => {
      values.linkFileName = Link.files;
      if (location.state && location.state.view) {
        setHideSectionLink(true);
        getAllProgramInfoSectionLink();
      } else {
        if (location.state && location.state.id) {
          values.programInfoId = location.state.id;
          // values.programInfoSectionId = values.programInfoSectionId;
        } else {
          values.programInfoId = sectionInfo.programInfoId;
          // values.programInfoSectionId = values.programInfoSectionId;
        }

        const response = await ProgramInfoServices.createProgramInfosInfoLinks(
          values,
        );
        if (response && response.data) {
          setHideSectionLink(true);
          getAllProgramInfoSectionLink();
        }
      }
    },
  });

  const sectionDropDown =
    sectionData &&
    sectionData.map((item: any, i: any) => {
      return { label: item.programInfoSectionName, value: item.id };
    });
  const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: '#DAF2CC',
      zIndex: 1,
      color: '#a9a3a3',
      width: 60,
      height: 60,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      color: '#0D9206',
    },
    completed: {
      backgroundColor: '#DAF2CC',
      color: '#0D9206',
    },
  });

  function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const steps = ['1', '2', '3'];

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}></div>
    );
  }

  const ColorlibConnector = withStyles({
    alternativeLabel: {
      top: 22,
    },
    active: {
      '& $line': {
        backgroundColor: '#DAF2CC',
      },
    },
    completed: {
      '& $line': {
        backgroundColor: '#DAF2CC',
      },
    },
    line: {
      height: 3,
      border: 0,
      backgroundColor: '#DAF2CC',
      borderRadius: 1,
    },
  })(StepConnector);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
    setHideSection(true);
    setHideSectionLink(true);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
      formik.setFieldValue('programInfoImage', file);
    });
  }, [completedCrop]);
  return (
    <div className='content add-page prg-info'>
      <div className='card'>
        {formik.values.programInfoHeader !== 'Important Indicators' && (
          <Stepper
            className='step-wrap'
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorlibConnector />}>
            <Step>
              <StepLabel onClick={handleStep(0)}>
                <h5>Step 1</h5>
                <h4>Page Content</h4>
              </StepLabel>
            </Step>

            <Step>
              <StepLabel onClick={handleStep(1)}>
                <h5>Step 2</h5>
                <h4>Sections</h4>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel onClick={handleStep(2)}>
                <h5>Step 3</h5>
                <h4>Links</h4>
              </StepLabel>
            </Step>
          </Stepper>
        )}
        {activeStep === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <div className='card-header'>
              <h4 className='cardtitlenew'>
                {location.state ? '' : 'Add Program Information'}
                {location.state &&
                  location.state.id &&
                  location.state.view &&
                  ' Program Information'}
                {location.state &&
                  location.state.id &&
                  !location.state.view &&
                  'Edit Program Information'}
              </h4>
            </div>
            <div className='card-body'>
              <div className='form-grp'>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }>
                  <div className='col-md-9'>
                    <label
                      htmlFor='programInfoHeader'
                      className='form-label required'>
                      Header
                    </label>
                    <input
                      name='programInfoHeader'
                      type='text'
                      value={formik.values.programInfoHeader}
                      onChange={formik.handleChange}
                      className={
                        formik.errors.programInfoHeader &&
                          formik.touched.programInfoHeader
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    <div className={'invalid-feedback'}>
                      {formik.errors.programInfoHeader
                        ? formik.errors.programInfoHeader
                        : null}
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className='form-grp'>
                <div className='col-md-9'>
                  <label className='form-label required'>
                    Short Description
                  </label>
                  <Editor
                    // id="inputText"
                    //name="programInfoDescriptionShortHTML"
                    init={{
                      plugins: 'link image code preview',
                      toolbar:
                        'undo redo | bold italic | alignleft aligncenter alignright | code',
                    }}
                    value={programInfoDescriptionShortHTML}
                    onEditorChange={ProgramInfoshortHandler}
                    apiKey={TINY_CLOUD_API_KEY}
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  />
                  <div
                    className={'invalid-feedback'}
                    style={{ display: 'contents' }}>
                    {formik.errors.programInfoDescriptionShortHTML
                      ? formik.errors.programInfoDescriptionShortHTML
                      : null}
                  </div>
                  {formik.values.programInfoDescriptionShortHTML.length > 0 &&
                    formik.values.programInfoDescriptionShortHTML.length <=
                    1000 &&
                    'Characters left: ' +
                    (1000 -
                      formik.values.programInfoDescriptionShortHTML.length)}
                </div>
              </div>
              <div className='form-grp'>
                <div className='col-md-9'>
                  <label className='form-label required'>
                    Long Description
                  </label>
                  <Editor
                    // id="inputText"
                    // name="programInfoDescriptionLongHTML"
                    init={{
                      plugins: 'link image code preview',
                      toolbar:
                        'undo redo | bold italic | alignleft aligncenter alignright | code',
                    }}
                    value={programInfoDescriptionLongHTML}
                    onEditorChange={ProgramInfolongHandler}
                    apiKey='8jeqhvqs1jqap8etksc28rytmtriu9mqt98kfbdwf2elsj0n'
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  />
                  <div
                    className={'invalid-feedback'}
                    style={{ display: 'contents' }}>
                    {formik.errors.programInfoDescriptionLongHTML
                      ? formik.errors.programInfoDescriptionLongHTML
                      : null}
                  </div>
                  {formik.values.programInfoDescriptionLongHTML.length > 0 &&
                    formik.values.programInfoDescriptionLongHTML.length <=
                    4000 &&
                    'Characters left: ' +
                    (4000 -
                      formik.values.programInfoDescriptionLongHTML.length)}
                </div>
              </div>
              <div className='form-grp'>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }>
                  <div className='col-md-9'>
                    <label className='form-label required'>Upload Image</label>
                    <div className='col-sm-12 admin-digital-signature-create'>
                      <input
                        type='file'
                        name='programInfoImage'
                        className={
                          formik.errors.programInfoImage &&
                            formik.touched.programInfoImage
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        // onChange={handleChangeImage}
                        onChange={onSelectFile}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.programInfoImage
                          ? formik.errors.programInfoImage
                          : null}
                      </div>
                    </div>
                    <br />
                    <div>
                      {' '}
                      <ReactCrop
                        src={upImg}
                        onImageLoaded={onLoad}
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                      />{' '}
                    </div>
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
                        programInfoFilepath &&
                        formdata && (
                          <img
                            src={`${programInfoFilepath}${formdata.programInfoImage}`}
                            width='320'
                            height='240'
                          />
                        )}
                    </div>
                  </div>
                </fieldset>
              </div>
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
                  onClick={() => history.push('/programInfosList')}>
                  Cancel
                </button>

                <button type='submit' className="btn font-chng"
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}>
                  {formik.values.programInfoHeader !== 'Important Indicators'
                    ? 'Next'
                    : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        )}
        {activeStep === 1 && (
          <div>
            {hideSection ? (
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-9 col-12'>
                    <h4 className='form-title'>ProgramInfo Section</h4>
                  </div>
                  {location && location.state && location.state.view ? (
                    ''
                  ) : (
                    <div className='col-md-3 col-12 text-right'>
                      <Button
                        variant='secondary'
                        className='mt-m'
                        onClick={hideSections}>
                        <img src={plusImg} className='pe-2' />
                        Add New
                      </Button>
                    </div>
                  )}
                </div>
                <div className='post-table'>
                  <DataTable
                    columns={columns1}
                    data={sectionData}
                    //expandableRows={true}
                    expandOnRowClicked={true}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    paginationComponentOptions={{
                      rowsPerPageText: 'Records per page:',
                      rangeSeparatorText: 'out of',
                    }}
                  />
                </div>
                <div className='form-grp text-right'>
                  <button
                    className='btn btn-outline-light'
                    onClick={handleBack}>
                    <i className='fas fa-arrow-left'></i>Back
                  </button>
                  <button
                    className='mt-m btn btn-secondary btn-pad'
                    onClick={handleNext}>
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className='card-body'>
                <form onSubmit={Sectionformik.handleSubmit}>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label
                        htmlFor='programInfoSectionName'
                        className='form-label'>
                        Section Name*
                      </label>
                      <input
                        name='programInfoSectionName'
                        value={Sectionformik.values.programInfoSectionName}
                        onChange={Sectionformik.handleChange}
                        className={
                          Sectionformik.errors.programInfoSectionName &&
                            Sectionformik.touched.programInfoSectionName
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {Sectionformik.errors.programInfoSectionName
                          ? Sectionformik.errors.programInfoSectionName
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label htmlFor='displayOrder' className='form-label'>
                        Display Order*
                      </label>
                      <input
                        name='displayOrder'
                        type='number'
                        value={
                          Sectionformik.values.displayOrder
                            ? Sectionformik.values.displayOrder
                            : ''
                        }
                        onChange={Sectionformik.handleChange}
                        className={
                          Sectionformik.errors.displayOrder &&
                            Sectionformik.touched.displayOrder
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {Sectionformik.errors.displayOrder
                          ? Sectionformik.errors.displayOrder
                          : null}
                      </div>
                    </div>

                    <div className='form-grp text-right'>
                      <button
                        className='btn btn-outline-light'
                        onClick={handleStep(1)}>
                        <i className='fas fa-arrow-left'></i>Back
                      </button>
                      {location && location.state && location.state.view ? (
                        ''
                      ) : (
                        <button type='submit' className='btn btn-secondary'>
                          submit
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        {activeStep === 2 && (
          <div>
            {hideSectionLink ? (
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-9 col-12'>
                    <h4 className='form-title'>ProgramInfo Section Link</h4>
                  </div>
                  <div className='col-md-3 col-12 text-right'>
                    {location && location.state && location.state.view ? (
                      ''
                    ) : (
                      <Button
                        variant='secondary'
                        className='mt-m'
                        onClick={hideSectionsLink}>
                        <img src={plusImg} className='pe-2' />
                        Add New
                      </Button>
                    )}
                  </div>
                </div>
                <div className='post-table'>
                  <DataTable
                    columns={columns2}
                    data={linkData}
                    //expandableRows={true}
                    expandOnRowClicked={true}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    paginationComponentOptions={{
                      rowsPerPageText: 'Records per page:',
                      rangeSeparatorText: 'out of',
                    }}
                  />
                </div>
                <div className='form-grp text-right'>
                  <button
                    type='submit'
                    className='btn btn-outline-light'
                    onClick={handleStep(1)}>
                    <i className='fas fa-arrow-left'></i>Back
                  </button>
                  <button
                    onClick={MoveProgramInfoListPage}
                    className='mt-m btn btn-secondary btn-pad'>
                    Finish
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={Linksformik.handleSubmit}
                onChange={Linksformik.handleChange}>
                <div className='card-body'>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label
                        htmlFor='programInfoSectionId'
                        className='form-label'>
                        Section Name*
                      </label>
                      <Select
                        name='programInfoSectionId'
                        className='custom-select'
                        isClearable='true'
                        onChange={(option: Option) => {
                          Linksformik.setFieldValue(
                            'programInfoSectionId',
                            option && option.value,
                          );
                        }}
                        value={
                          sectionDropDown
                            ? sectionDropDown.find(
                              (option: any) =>
                                option &&
                                option.value ===
                                Linksformik.values.programInfoSectionId,
                            )
                            : ''
                        }
                        options={sectionDropDown}></Select>
                      <div className={'invalid-feedback'}>
                        {Linksformik.errors
                          ? Linksformik.errors.programInfoSectionId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label htmlFor='displayOrder' className='form-label'>
                        Display Order*
                      </label>
                      <input
                        name='displayOrder'
                        type='number'
                        value={
                          Linksformik.values.displayOrder
                            ? Linksformik.values.displayOrder
                            : ''
                        }
                        onChange={Linksformik.handleChange}
                        className={
                          Linksformik.errors.displayOrder &&
                            Linksformik.touched.displayOrder
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {Linksformik.errors.displayOrder
                          ? Linksformik.errors.displayOrder
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label htmlFor='linkName' className='form-label'>
                        Link Name*
                      </label>
                      <input
                        name='linkName'
                        type='text'
                        value={Linksformik.values.linkName}
                        onChange={Linksformik.handleChange}
                        className={
                          Linksformik.errors.linkName &&
                            Linksformik.touched.linkName
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {Linksformik.errors.linkFileName
                          ? Linksformik.errors.linkFileName
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label htmlFor='linkFileType' className='form-label'>
                        Link File Type*
                      </label>
                      <Select
                        className='custom-select'
                        name='linkFileType'
                        // value={formik.values.linkFileType}
                        // onChange={formik.handleChange}
                        isClearable='true'
                        // onChange={(e) => hidesourcerounddist(e)}
                        onChange={(option: Option) => {
                          Linksformik.setFieldValue(
                            'linkFileType',
                            option && option.value,
                          );
                        }}
                        value={
                          linkfileValues
                            ? linkfileValues.find(
                              (option: any) =>
                                option &&
                                option.value ===
                                Linksformik.values.linkFileType,
                            )
                            : ''
                        }
                        options={linkfileValues}></Select>
                      <div className={'invalid-feedback'}>
                        {Linksformik.errors.linkFileType
                          ? Linksformik.errors.linkFileType
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label className='form-label'>File Upload</label>
                      <div className='col-sm-12 admin-digital-signature-create'>
                        <input
                          type='file'
                          name='linkFileName'
                          className={
                            Linksformik.errors.linkFileName &&
                              Linksformik.touched.linkFileName
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          onChange={handleChangeLinks}
                        />
                        <div className={'invalid-feedback'}>
                          {Linksformik.errors.linkFileName
                            ? Linksformik.errors.linkFileName
                            : null}
                        </div>
                      </div>
                      {linksInfo.linkFileName && (
                        <a
                          target='_blank'
                          href={`${filepath}${linksInfo.linkFileName}`}>
                          {linksInfo.linkFileName}
                        </a>
                      )}{' '}
                      {/* <div>
                        {Link &&
                          Link.preview &&
                          Linksformik.values.linkFileType === 'image' && (
                            <img src={Link.preview} width='320' height='240' />
                          )}
                        {Link &&
                          Link.preview &&
                          Linksformik.values.linkFileType === 'video' && (
                            <video
                              src={Link.preview}
                              width='320'
                              height='240'
                              controls></video>
                          )}
                        {Link &&
                          Link.preview &&
                          Linksformik.values.linkFileType === 'pdf' && (
                            <embed
                              src={Link.preview}
                              width='320'
                              height='240'></embed>
                          )}
                        {Link &&
                          Link.preview &&
                          Linksformik.values.linkFileType === 'audio' && (
                            <audio controls>
                              <source src={Link.preview}></source>
                            </audio>
                          )}
                      </div>
                      <div className={Link && Link.preview ? 'd-none' : ''}>
                        {linksInfo.linkFileType === 'image' &&
                          filepath &&
                          linksInfo.linkFileName && (
                            <img
                              src={`${filepath}${linksInfo.linkFileName}`}
                              width='320'
                              height='240'></img>
                          )}
                        {linksInfo.linkFileType === 'video' &&
                          filepath &&
                          linksInfo.linkFileName && (
                            <video
                              src={`${filepath}${linksInfo.linkFileName}`}
                              width='320'
                              height='240'
                              controls></video>
                          )}
                        {linksInfo.linkFileType === 'pdf' &&
                          filepath &&
                          linksInfo.linkFileName && (
                            <embed
                              src={`${filepath}${linksInfo.linkFileName}&output=embed`}
                              width='320'
                              height='240'></embed>
                          )}
                        {linksInfo.linkFileType === 'audio' &&
                          filepath &&
                          linksInfo.linkFileName && (
                            <audio controls>
                              <source
                                src={`${filepath}${linksInfo.linkFileName}`}></source>
                            </audio>
                          )}
                      </div>
                     */}
                    </div>
                  </div>
                  <div className="form-grp buttongrouprightend mb-4">
                    <button
                      type='submit'
                      className="btn font-chng"
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                        textTransform: 'none',
                      }}
                      onClick={handleStep(2)}>
                      <i className='fas fa-arrow-left'></i>Back
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
                        }}
                      >
                        submit
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteprogramInfosform;

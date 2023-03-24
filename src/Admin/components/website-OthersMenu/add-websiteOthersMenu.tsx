/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ApplicationState } from '../../redux';
import Select, { Option } from 'react-select';
import { Row } from 'react-bootstrap';
import MenusService from '../../../helpers/services/website-otherMenu.service';
import history from '../../../helpers/history';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import Button from 'react-bootstrap/Button';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import {
  OtherMenuInfoSection,
  OtherMenuInfoLinks,
  WebsiteOthersMenu,
} from '../../../helpers/interfaces/website-othersMenu';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import plusImg from '../../assets/images/add_new.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  menuvalues,
  linkfileValues,
  sectionInfoinitial,
  linkInfoinitial,
  sectionInitialInfoinitial,
} from './constant';
import { BASE_URL } from '../../../helpers/config';

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: '#B8E3FC',
    },
    backgroundColor: '#B8E3FC',
  },
  completed: {
    '& $line': {
      backgroundColor: '#B8E3FC',
    },
    backgroundColor: '#B8E3FC',
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#E5E5E5',
    borderRadius: 1,
  },
})(StepConnector);

const AddOthersMenu: React.FC = () => {
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const location = useLocation<any>();
  let WebsiteOthersMenus: WebsiteOthersMenu[] = [];

  const [menuValues, setmenuValues] = useState<any>(menuvalues);
  const [selectedmenutype, setselectedmenutype] = useState<any>();
  const [filepath, setfilepath] = useState<any>({});
  const [Menu, setMenu] = React.useState<any>({ files: null });
  const [activeStep, setActiveStep] = React.useState(0);
  const [hideSection, setHideSection] = useState(true);
  const [hideSectionLink, setHideSectionLink] = useState(true);
  const [sectionInfo, setSectionInfo] = useState<OtherMenuInfoSection>({
    ...sectionInfoinitial,
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
  const [linksInfo, setLinksInfo] = useState<OtherMenuInfoLinks>({
    ...linkInfoinitial,
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
  const [sectionInitialInfo] = useState<OtherMenuInfoSection>(
    sectionInitialInfoinitial
  );
  const [linksInitialInfo] = useState<OtherMenuInfoLinks>({
    otherMenuId: 0,
    otherMenuSectionId: '',
    linkName: '',
    displayOrder: '',
    linkFileName: '',
    linkFileType: '',
    isActive: true,
    createdBy: 0,
    lastModifiedBy: 0,
  });
  const [Link, setLink] = React.useState<any>({ files: null });
  const [sectionData, setSectionData] = useState([]);
  const [linkData, setLinkData] = useState([]);
  const [initialValues, setInitialvalues] = useState({
    menuType: '',
    menuPageTitle: '',
    menuContentImageName: '',
    menuContentHTML: '',
    isActive: true,
    createdBy: ReduxLoginInfo.Admin.login.entities.createdBy,
    lastModifiedBy: ReduxLoginInfo.Admin.login.entities.lastModifiedBy,
  });
  const [menuList, setMenuList]: [
    WebsiteOthersMenu[],
    (menuList: WebsiteOthersMenu[]) => void
  ] = React.useState(WebsiteOthersMenus);

  const sectionDropDown =
    sectionData &&
    sectionData.map((item: any, i: any) => {
      return { label: item.menuSectionName, value: item.id };
    });
  const validSchema = Yup.object().shape({
    menuType: Yup.string().required('required'),
    menuPageTitle: Yup.string().required('required'),
    menuContentImageName: Yup.string(),
    menuContentHTML: Yup.string()
      .required('required')
      .max(1000, 'Maximum characters are 1000'),
  });
  const sectionValidationSchema = Yup.object().shape({
    menuSectionName: Yup.string().required('required').nullable(),
    displayOrder: Yup.number().required('required').nullable(),
  });
  const linkValidationSchema = Yup.object().shape({
    displayOrder: Yup.number().required('required').nullable(),
    linkName: Yup.string().required('required').nullable(),
    linkFileName: Yup.string().required('required').nullable(),
    linkFileType: Yup.string().required('required').nullable(),
  });
  const formik = useFormik({
    initialValues: {
      menuType: initialValues.menuType ? initialValues.menuType : '',
      menuContentImageName: initialValues.menuContentImageName
        ? initialValues.menuContentImageName
        : '',
      menuPageTitle: initialValues.menuPageTitle
        ? initialValues.menuPageTitle
        : '',
      menuContentHTML:
        initialValues && initialValues.menuContentHTML
          ? initialValues.menuContentHTML
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
      value.others = Menu.files;
      setInitialvalues(value);
      let response;
      if (location && location.state && location.state.id) {
        response = await MenusService.updateWebsiteOtherMenu(
          value,
          location.state.id
        );
      } else {
        response = await MenusService.postWebsiteOtherMenu(value);
      }
      if (response.status == 200) {
        setSectionInfo({
          ...sectionInfo,
          otherMenuId: response.data.id,
        });
        getAllOtherMenuSection(response.data.id);
        handleNext();
      } else {
        toast.error(response.message, {
          position: toast.POSITION.TOP_CENTER,
          className: 'toast-message',
        });
      }
    },
  });
  const Sectionformik = useFormik({
    initialValues: sectionInfo,
    enableReinitialize: true,
    validationSchema: sectionValidationSchema,
    onSubmit: async (values: any) => {
      if (location && location.state && location.state.view) {
        setHideSection(true);
        getAllOtherMenuSection('');
      } else {
        if (location && location.state && location.state.id) {
          values.otherMenuId = location.state.id;
        } else {
          values.otherMenuId = sectionInfo.otherMenuId;
        }
        let response = await MenusService.postWebsiteOtherMenuSection(values);
        setLinksInfo({ ...linksInfo, otherMenuSectionId: response.data.id });
        setHideSection(true);
        getAllOtherMenuSection('');
      }
    },
  });
  const Linksformik = useFormik({
    initialValues: linksInfo,
    enableReinitialize: true,
    validationSchema: linkValidationSchema,
    onSubmit: async (values: any) => {
      values.otherslink = Link.files;
      if (location.state && location.state.view) {
        setHideSectionLink(true);
        // getAllOtherMenuSectionLink();
      } else {
        if (location.state && location.state.id) {
          values.otherMenuId = location.state.id;
        } else {
          values.otherMenuId = sectionInfo.otherMenuId;
        }
        const response = await MenusService.createOtherMenuInfoLinks(values);
        if (response && response.data) {
          setHideSectionLink(true);
          getAllOtherMenuSectionLink();
        }
      }
    },
  });
  const columns1 = [
    {
      name: 'Section Name',
      selector: 'menuSectionName',
    },
    {
      name: 'Display Order',
      selector: 'displayOrder',
    },
    {
      name: 'Date Of Submission',
      selector: (row: any) => (
        <div>{moment(row.createdAt).format('DD/MM/YYYY')}</div>
      ),
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
      selector: (row: any) => {
        return row.websiteContentOthersSection &&
          row.websiteContentOthersSection.menuSectionName
          ? row.websiteContentOthersSection.menuSectionName
          : '';
      },
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
      selector: (row: any) => (
        <div>{moment(row.createdAt).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      name: 'Last Modified',
      selector: (row: any) => (
        <div>{moment(row.updatedAt).format('DD/MM/YYYY')}</div>
      ),
    },

    {
      name: 'Actions',
      selector: 'Actions',
      cell: (row) => (
        <div data-tag='allowRowEvents'>
          <button className='btn' onClick={() => getOneSectionLinkInfo(row)}>
            <img alt='' src={viewIcon} />
          </button>
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button
                onClick={() => getOneSectionLinkInfo(row)}
                className='btn'
              >
                <img alt='' src={editIcon} />
              </button>
              <button onClick={() => deleteLink(row)} className='btn'>
                <img alt='' src={deleteIcon} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleChangeMenu = (e: any) => {
    if (e.target.value.length) {
      formik.setFieldValue('menuContentImageName', e.target.files[0]);
      setMenu({
        preview: URL.createObjectURL(e.target.files[0]),
        files: e.target.files[0],
      });
    }
  };
  const getData = async () => {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await MenusService.getOneWebsiteOtherMenuInfo(id);
      if (response && response.data) {
        setInitialvalues(response.data[0]);
        setselectedmenutype(
          menuValues.find((val) => {
            return val.label == response.data[0].menuType;
          })
        ); // setfilepath(response.filepath);
        setfilepath(`${BASE_URL}/websitecontent-others/blogs/`);
      }
    }
  };
  async function getAllMenus() {
    const response = await MenusService.getWebsiteOtherMenuInfo();
    if (response && response.data) {
      WebsiteOthersMenus = response.data;
      setMenuList(response.data);
      let res = response.data.map((data) => {
        return data.menuType;
      });
      setmenuValues(
        menuValues.filter((val) => {
          return res.indexOf(val.label) == -1;
        })
      );
    }
  }
  const OtherMenuInfolongHandler = (value, editor) => {
    formik.setFieldValue('menuContentHTML', value);
  };
  const handleStep = (step: number) => () => {
    setActiveStep(step);
    setHideSection(true);
    setHideSectionLink(true);
  };
  const getOneSectionInfo = async (row) => {
    setHideSection(false);
    setSectionInfo({ sectionInfo, ...row });
  };
  const getOneSectionLinkInfo = async (row) => {
    setHideSectionLink(false);
    setLinksInfo({ linksInfo, ...row });
  };
  async function deleteSection(row) {
    const deleteResult: any = await MenusService.deleteWebsiteOtherMenuSection(
      row.id
    );
    if (deleteResult.status === 200) {
      getAllOtherMenuSection('');
    }
  }
  async function deleteLink(row) {
    const deleteResult: any = await MenusService.deleteOtherMenuInfoLink(
      row.id
    );
    if (deleteResult.status === 200) {
      getAllOtherMenuSectionLink();
    }
  }
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
  function MoveOtherMenuInfoListPage() {
    history.push('/listMenu');
  }
  const getAllOtherMenuSection = async (id: any) => {
    let otherMenuId;
    if (location && location.state && location.state.id) {
      otherMenuId = location.state.id;
    } else {
      otherMenuId = sectionInfo.otherMenuId;
    }
    const response = await MenusService.getWebsiteOtherMenuSectionInfo(
      id == '' ? otherMenuId : id
    );
    if ((response && response.data) || response.message == 'EMPTY') {
      setHideSection(true);
      setSectionData(response.data);
    }
  };
  const getAllOtherMenuSectionLink = async () => {
    let otherMenuId;
    if (location && location.state && location.state.id) {
      otherMenuId = location.state.id;
    } else {
      otherMenuId = sectionInfo.otherMenuId;
    }
    const response = await MenusService.getOtherMenuInfoLinkListALL(
      otherMenuId
    );
    if ((response && response.data) || response.message == 'EMPTY') {
      setLinkData(response.data);
      setfilepath(`${BASE_URL}/websitecontent-others/otherslink/`);
      setHideSectionLink(true);
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
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    getData();
    getAllOtherMenuSection('');
    getAllOtherMenuSectionLink();
  };

  useEffect(() => {
    getAllMenus();
    getData();
    getAllOtherMenuSection('');
    getAllOtherMenuSectionLink();
  }, []);

  return (
    <div className='content add-page prg-info'>
      <div className='card'>
        <Stepper
          className='step-wrapnew'
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorlibConnector />}
        >
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
        {activeStep === 0 && (
          <form name='WebsiteMenusform' onSubmit={formik.handleSubmit}>
            <div className='card-body'>
              <div className='col-md-9 col-12'>
                <h4 className='cardtitlenew'>
                  {location.state ? '' : 'Add Other Information'}
                  {location.state &&
                    location.state.id &&
                    location.state.view &&
                    ' Other Information'}
                  {location.state &&
                    location.state.id &&
                    !location.state.view &&
                    'Edit Other Information'}
                </h4>
              </div>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label htmlFor='menuType' className='form-label required'>
                        Menu Type
                      </label>
                      <Select
                        className='custom-select'
                        name='menuType'
                        isClearable='true'
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'menuType',
                            option && option.value
                          );
                          setselectedmenutype(option);
                        }}
                        value={selectedmenutype}
                        options={menuValues}
                        isDisabled={
                          true
                          // location.state && location.state.view ? true : false
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.menuType ? formik.errors.menuType : null}
                      </div>
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label
                        htmlFor='menuPageTitle'
                        className='form-label required'
                      >
                        Page Title
                      </label>
                      <input
                        name='menuPageTitle'
                        type='text'
                        value={formik.values.menuPageTitle}
                        onChange={formik.handleChange}
                        className={
                          formik.errors.menuPageTitle &&
                          formik.touched.menuPageTitle
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.menuPageTitle
                          ? formik.errors.menuPageTitle
                          : null}
                      </div>
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className='form-grp' style={{ zIndex: 0 }}>
                    <div className='col-md-9' style={{ display: 'block' }}>
                      <label className='form-label required'>
                        Long Description
                      </label>
                      <Editor
                        // id="inputText"
                        //name='menuContentHTML'
                        init={{
                          plugins: 'link image code preview',
                          toolbar:
                            'undo redo | bold italic | alignleft aligncenter alignright | code',
                        }}
                        value={formik.values.menuContentHTML}
                        onEditorChange={OtherMenuInfolongHandler}
                        apiKey='8jeqhvqs1jqap8etksc28rytmtriu9mqt98kfbdwf2elsj0n'
                        disabled={
                          location.state && location.state.view ? true : false
                        }
                      />
                      <div
                        className={'invalid-feedback'}
                        style={{ display: 'contents' }}
                      >
                        {formik.errors.menuContentHTML
                          ? formik.errors.menuContentHTML
                          : null}
                      </div>
                      {formik.values.menuContentHTML.length > 0 &&
                        formik.values.menuContentHTML.length <= 1000 &&
                        'Characters left: ' +
                          (1000 - formik.values.menuContentHTML.length)}
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label
                        htmlFor='menuContentImageName'
                        className='form-label required'
                      >
                        Upload File
                      </label>
                      <input
                        type='file'
                        name='menuContentImageName'
                        className={
                          formik.errors.menuContentImageName &&
                          formik.touched.menuContentImageName
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        onChange={handleChangeMenu}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.menuContentImageName
                          ? formik.errors.menuContentImageName
                          : null}
                      </div>
                    </div>
                  </div>
                </Row>
                <div>
                  {Menu.preview && (
                    <img alt='' src={Menu.preview} width='320' height='240' />
                  )}
                </div>
                <div className={Menu && Menu.preview ? 'd-none' : ''}>
                  {filepath && initialValues.menuContentImageName && (
                    <img
                      alt=''
                      src={`${filepath}${initialValues.menuContentImageName}`}
                      width='320'
                      height='240'
                    ></img>
                  )}
                </div>
              </fieldset>
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
                    onClick={() => history.push('/listMenu')}
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
                      Next
                    </button>
                  )}
                </div>
              </Row>
            </div>
          </form>
        )}
        {activeStep === 1 && (
          <div>
            {hideSection ? (
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-9 col-12'>
                    <h4 className='cardtitlenew'>Other Menu Info Section</h4>
                  </div>
                  {location && location.state && location.state.view ? (
                    ''
                  ) : (
                    <div className='col-md-3 col-12 text-right'>
                      <Button
                        variant='secondary'
                        className='mt-m font-chng mr10 btn btn-secondary'
                        style={{
                          backgroundColor: 'rgb(25, 216, 149)',
                          border: 'none',
                          borderRadius: '30px',
                        }}
                        onClick={hideSections}
                      >
                        <img alt='' src={plusImg} className='pe-2' />
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
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className='btn font-chng'
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                      textTransform: 'none',
                    }}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className='card-body'>
                <form onSubmit={Sectionformik.handleSubmit}>
                  <div className='form-grp row'>
                    <div className='col-md-6 col-xl-6'>
                      <label
                        htmlFor='menuSectionName'
                        className='form-label required'
                      >
                        Section Name*
                      </label>
                      <input
                        name='menuSectionName'
                        value={Sectionformik.values.menuSectionName}
                        onChange={Sectionformik.handleChange}
                        className={
                          Sectionformik.errors.menuSectionName &&
                          Sectionformik.touched.menuSectionName
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {Sectionformik.errors.menuSectionName
                          ? Sectionformik.errors.menuSectionName
                          : null}
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-6'>
                      <label
                        htmlFor='displayOrder'
                        className='form-label required'
                      >
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
                  </div>
                  <div className='form-grp'>
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
                        onClick={handleStep(1)}
                      >
                        Back
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
                    <h4 className='formtitlenew'>Other Menu Section Link</h4>
                  </div>
                  <div className='col-md-3 col-12 text-right'>
                    {location && location.state && location.state.view ? (
                      ''
                    ) : (
                      <Button
                        variant='secondary'
                        className='mt-m font-chng mr10 btn btn-secondary'
                        style={{
                          backgroundColor: 'rgb(25, 216, 149)',
                          border: 'none',
                          borderRadius: '30px',
                        }}
                        onClick={hideSectionsLink}
                      >
                        <img alt='' src={plusImg} className='pe-2' />
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
                <div className='form-grp buttongrouprightend mb-4'>
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
                    onClick={handleStep(1)}
                  >
                    Back
                  </button>
                  <button
                    onClick={MoveOtherMenuInfoListPage}
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
                </div>
              </div>
            ) : (
              <form
                onSubmit={Linksformik.handleSubmit}
                onChange={Linksformik.handleChange}
              >
                <div className='card-body'>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label
                        htmlFor='otherMenuSectionId'
                        className='form-label required'
                      >
                        Section Name*
                      </label>
                      <Select
                        name='otherMenuSectionId'
                        className='custom-select'
                        isClearable='true'
                        onChange={(option: Option) => {
                          option &&
                            Linksformik.setFieldValue(
                              'otherMenuSectionId',
                              option.value
                            );
                        }}
                        value={
                          sectionDropDown
                            ? sectionDropDown.find(
                                (option: any) =>
                                  option &&
                                  option.value ===
                                    Linksformik.values.otherMenuSectionId
                              )
                            : ''
                        }
                        options={sectionDropDown}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {Linksformik.errors
                          ? Linksformik.errors.otherMenuSectionId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label
                        htmlFor='displayOrder'
                        className='form-label required'
                      >
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
                      <label htmlFor='linkName' className='form-label required'>
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
                      <label
                        htmlFor='linkFileType'
                        className='form-label required'
                      >
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
                            option && option.value
                          );
                        }}
                        value={
                          linkfileValues
                            ? linkfileValues.find(
                                (option: any) =>
                                  option &&
                                  option.value ===
                                    Linksformik.values.linkFileType
                              )
                            : ''
                        }
                        options={linkfileValues}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {Linksformik.errors.linkFileType
                          ? Linksformik.errors.linkFileType
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className='form-grp'>
                    <div className='col-md-9'>
                      <label className='form-label required'>File Upload</label>
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
                      <br />
                      {linksInfo.linkFileName && (
                        <a
                          target='_blank'
                          href={`${filepath}${linksInfo.linkFileName}`}
                        >
                          {linksInfo.linkFileName}
                        </a>
                      )}
                      {/* <div>
                        <br></br>
                        {Link &&
                          Link.preview &&
                          Linksformik.values.linkFileType === 'image' && (
                            <img
                              alt=''
                              src={Link.preview}
                              width='320'
                              height='240'
                            />
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
                        <br />
                        {linksInfo.linkFileType === 'image' &&
                          filepath &&
                          linksInfo.linkFileName && (
                            <img
                              alt=''
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
                  <div className='form-grp buttongrouprightend mb-4'>
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
                      onClick={handleStep(2)}
                    >
                      Back
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
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddOthersMenu;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FaqsService from '../../../helpers/services/website-faqs.service';
import { ApplicationState } from '../../redux';
import history from '../../../helpers/history';
import { Editor } from '@tinymce/tinymce-react';
import { TINY_CLOUD_API_KEY } from '../../../helpers/config';
import Row from 'react-bootstrap/Row';

const WebsiteFaqsform: React.FC = () => {
  const location = useLocation<any>();
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const [formdata, setformdata] = useState<any>();
  const [answer, setanswer] = useState('');

  useEffect(() => {
    getEditData();
  }, []);

  async function getEditData() {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await FaqsService.getOneFaqsInfo(id);
      if (response) {
        let arr: any = response.data;
        setformdata(arr[0]);
        setanswer(arr[0].answer);
      }
    }
  }

  const answerHandler = (value, editor: any) => {
    setanswer(value);
    formik.setFieldValue('answer', value);
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required('Required'),
    answer: Yup.string()
      .required('Required')
      .max(4000, 'Maximum characters are 4000'),
    isShowPublic: Yup.boolean(),
    displayOrder: Yup.number().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      question: formdata && formdata.question ? formdata.question : '',
      answer: formdata && formdata.answer ? formdata.answer : '',
      displayOrder:
        formdata && formdata.displayOrder ? formdata.displayOrder : '',
      isShowPublic:
        formdata && formdata.isShowPublic ? formdata.isShowPublic : '',
      isActive: true,
      createdBy: 1, //ReduxLoginInfo.Admin.login.entities.createdBy
      lastModifiedBy: 1, //ReduxLoginInfo.Admin.login.entities.lastModifiedBy
    },
    enableReinitialize: true,
    validationSchema: validationSchema,

    onSubmit: async (values: any) => {
      values.answer = values.answer;
      if (location.state && location.state.id) {
        const id: any = location.state.id;
        const response = await FaqsService.editFaqsInfo(id, values);
        history.push('/faqsList');
      } else {
        let response = await FaqsService.createFaqsInfo(values);
        history.push('/faqsList');
      }
    },
  });

  return (
    <div className='content add-page'>
      <div className='card'>
        <div className='card-header'>
          <h4 className='cardtitlenew'>
            {location.state ? '' : 'Add FAQ'}
            {location.state &&
              location.state.id &&
              location.state.view &&
              'FAQ'}
            {location.state &&
              location.state.id &&
              !location.state.view &&
              'Edit FAQ'}
          </h4>
        </div>
        <div className='card-body'>
          <form style={{ width: '100%' }} onSubmit={formik.handleSubmit}>
            <fieldset>
              <Row>
                <div className='col-md-9'>
                  <div className='form-grp'>
                    <label htmlFor='question' className='form-label required'>
                      question
                    </label>
                    <input
                      name='question'
                      type='text'
                      value={formik.values.question}
                      onChange={formik.handleChange}
                      className={
                        formik.errors.question && formik.touched.question
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    <div className={'invalid-feedback'}>
                      {formik.errors.question ? formik.errors.question : null}
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
                </div>
              </Row>
            </fieldset>
            <div className='form-grp'>
              <div className='col-md-9'>
                <label className='form-label required'>answer </label>
                <Editor
                  // id="inputText"
                  // name="answer"
                  init={{
                    plugins: 'link image code preview',
                    toolbar:
                      'undo redo | bold italic | alignleft aligncenter alignright | code',
                  }}
                  value={answer}
                  onEditorChange={answerHandler}
                  apiKey={TINY_CLOUD_API_KEY}
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                />
                <div className={'text-danger'}>
                  {formik.errors.answer ? formik.errors.answer : null}
                </div>
                {formik.values.answer.length > 0 &&
                  formik.values.answer.length <= 4000 &&
                  'Characters left: ' + (4000 - formik.values.answer.length)}
              </div>
            </div>
            <div className='form-grp'>
              <div className='col-md-9'>
                <label htmlFor='displayOrder' className='form-label required'>
                  Display Order
                </label>
                <input
                  name='displayOrder'
                  type='number'
                  value={
                    formik.values.displayOrder ? formik.values.displayOrder : ''
                  }
                  onChange={formik.handleChange}
                  className={
                    formik.errors.displayOrder && formik.touched.displayOrder
                      ? 'form-control is-invalid'
                      : 'form-control'
                  }
                />
                <div className={'invalid-feedback'}>
                  {formik.errors.displayOrder
                    ? formik.errors.displayOrder
                    : null}
                </div>
              </div>
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
                onClick={() => history.push('/faqsList')}>
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
                  submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFaqsform;

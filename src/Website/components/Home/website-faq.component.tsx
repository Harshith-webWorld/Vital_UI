import React, { useState } from 'react';
import { WebsiteContentFaqs } from '../../../helpers/interfaces/websitecontent-faq';
import Accordion from 'react-bootstrap/Accordion';
import FAqsService from '../../../helpers/services/website-faqs.service';
import ReactHtmlParser, {
  convertNodeToElement,
  processNodes,
} from 'react-html-parser';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    acchead: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '13px',
      lineHeight: '20px',
      color: '#000000',
      background: 'rgba(172, 191, 200, 0.1)',
      borderRadius: '4px',
      border: '0px',
    },
  }),
);

const FaqsComponent: React.FC = () => {
  const classes = useStyles();
  let websiteContentFaqsData: WebsiteContentFaqs[] = [];
  const [websiteContentFaqs, setWebsiteContentFaqs]: [
    WebsiteContentFaqs[],
    (websiteContentFaqs: WebsiteContentFaqs[]) => void,
  ] = React.useState(websiteContentFaqsData);

  React.useEffect(() => {
    getWebsitesiteFaqs();
  }, []);

  const options = {
    decodeEntities: true,
  };

  var Faqs: any = [];
  if (websiteContentFaqs) {
    Faqs = websiteContentFaqs.map((faq, id) => {
      if (faq.isShowPublic)
        return (
          <React.Fragment key={faq.id}>
            <Accordion.Item
              key={faq.id}
              eventKey={id.toString()}
              style={{ border: '0px' }}>
              <Accordion.Header className={classes.acchead}>
                {faq.question}
              </Accordion.Header>
              <Accordion.Body>
                {ReactHtmlParser(faq.answer, options)}
              </Accordion.Body>
            </Accordion.Item>
            <br />
          </React.Fragment>
        );
    });
  }
  async function getWebsitesiteFaqs() {
    const response = await FAqsService.getFaqsInfo();
    if (response) {
      websiteContentFaqsData = response.data;
      setWebsiteContentFaqs(
        response.data.sort((a, b) =>
          a.displayOrder < b.displayOrder ? -1 : 1,
        ),
      );
    }
  }

  return (
    <div
      className='faq-secnew'
      style={{ backgroundColor: '#F8F8FB', padding: '35px 0px 70px 0px' }}>
      <div className='container'>
        <h4
          className='faq-head'
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '19.52px',
            lineHeight: '29px',
            color: '#495057',
            backgroundColor: 'tranparent',
            textAlign: 'center',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
          Frequently asked questions
        </h4>
        <div
          style={{
            background: '#FFFFFF',
            boxShadow: '0px 12px 24px rgba(18, 38, 63, 0.0313726)',
            borderRadius: '4px',
            padding: '20px',
          }}>
          <p
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '22px',
              color: '#495057',
            }}>
            General Questions
          </p>
          <Accordion defaultActiveKey='0' style={{ border: 'none' }}>
            {Faqs}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FaqsComponent;

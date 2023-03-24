import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import plusImg from '../../assets/images/add_new.png';
import FaqsService from '../../../helpers/services/website-faqs.service';
import history from '../../../helpers/history';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SettingsService from '../../../helpers/services/website-settings.service';

const WebsiteFaqsList: React.FC = () => {
  const [faqsList, setfaqsList] = useState([]);
  const [limit, setlimit] = React.useState<any>(0);

  useEffect(() => {
    getFaqsList();
  }, []);
  async function getSettings() {
    const response = await SettingsService.getWebsiteSettingsDataInfo();
    if (response && response.data) {
      let temp = response.data.find((item) => {
        if (item.settingKey == 'FAQCountLimit' && item.isEnabled) return item;
      });
      temp !== undefined && setlimit(parseInt(temp.settingValue));
    }
  }

  async function getFaqsList() {
    const response = await FaqsService.getFaqsInfo();
    if (response) {
      var faqlist = response.data;
      setfaqsList(response.data);
      getSettings();
    }
  }

  const onFaqsRemove = async (event: any, id: any) => {
    event.persist();
    const response = await FaqsService.deleteFaqsInfo(id);
    getFaqsList();
  };

  const Delete = (event: any, id: any) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onFaqsRemove(event, id);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const columns = [
    {
      name: 'Questions',
      selector: 'question',
    },
    {
      name: 'Answer',
      selector: 'answer',
      format: (row) =>
        row.answer.length < 100
          ? row.answer.replace(/(<([^>]+)>)/gi, '')
          : `${row.answer.slice(0, 100).replace(/(<([^>]+)>)/gi, '')}...`,
    },
    {
      name: 'Display order',
      selector: 'displayOrder',
    },
    {
      name: ' Show on Home page',
      selector: (row: any) => (row.isShowPublic ? 'Y' : 'N'),
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
      button: true,
      cell: (row: any) =>
        row.isActive ? (
          <>
            <button
              className='btn'
              onClick={() =>
                history.push('/faqsForm', { id: row.id, view: 'viewOnly' })
              }
            >
              <img src={viewIcon} />
            </button>
            <button
              className='btn'
              onClick={() => history.push('/faqsForm', { id: row.id })}
            >
              <img src={editIcon} />
            </button>
            <button className='btn' onClick={(e: any) => Delete(e, row.id)}>
              <img src={deleteIcon} />
            </button>
          </>
        ) : null,
    },
  ];

  return (
    <div>
      <div className='content'>
        <div className='card'>
          <div className='card-header'>
            <div className='row'>
              <div className='col-md-9'>
                <h4 className='cardtitlenew font-chng'>FAQs</h4>
              </div>
              <div className='col-md-3 text-right'>
                {limit > faqsList.length && (
                  <Link className='btn btn-secondary' to='/faqsForm'>
                    <img src={plusImg} className='pe-2' /> Add New
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className='card-body'>
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={faqsList}
                highlightOnHover
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationComponentOptions={{
                  rowsPerPageText: 'Records per page:',
                  rangeSeparatorText: 'out of',
                }}
                customStyles={{
                  rows: {
                    style: {
                      minHeight: '90px',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFaqsList;

import React, { useEffect, useState } from 'react';
import '../../assets/scss/admin.scss';
import NewsService from '../../../helpers/services/website-news.service';
import { WebsiteContentNews } from '../../../helpers/interfaces/websitecontent-news';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DataTable from 'react-data-table-component';
import history from '../../../helpers/history';
import plusImg from '../../assets/images/add_new.png';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import moment from 'moment';
import SettingsService from '../../../helpers/services/website-settings.service';

const WebsiteNewsList: React.FC<any> = () => {
  let WebsiteContentData: WebsiteContentNews[] = [];
  const [newlist, setNewlist] = React.useState(WebsiteContentData);
  const [limit, setlimit] = React.useState<any>(0);

  useEffect(() => {
    getNews();
  }, []);

  async function getNews() {
    const response = await NewsService.getNewsInfo();
    if (response && response.data) {
      WebsiteContentData = response.data;
      response && response.data && setNewlist(response.data);
    }
  }
  async function DeleteNews(id: number) {
    const response = await NewsService.deleteNews(id);
    if (response.message == 'Deleted successfully') {
      getNews();
    }
  }

  const Delete = (event: any, id: number) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            DeleteNews(id);
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
      name: 'Header',
      selector: 'newsHeader',
    },
    {
      name: 'Short Description',
      selector: 'newsDescriptionShortHTML',
      format: (row) =>
        row.newsDescriptionShortHTML.length < 100
          ? row.newsDescriptionShortHTML.replace(/(<([^>]+)>)/gi, '')
          : `${row.newsDescriptionShortHTML
              .slice(0, 100)
              .replace(/(<([^>]+)>)/gi, '')}...`,
    },
    {
      name: 'Long Description',
      selector: (row: any) =>
        row.newsDescriptionLongHTML !== 'undefined'
          ? row.newsDescriptionLongHTML
          : 'Nil',
      format: (row: any) => {
        console.log('row', row.newsDescriptionLongHTML);
        // return row.newsDescriptionLongHTML
        if (row.newsDescriptionLongHTML) {
          return row.newsDescriptionLongHTML.length < 100
            ? row.newsDescriptionLongHTML.replace(/(<([^>]+)>)/gi, '')
            : `${row.newsDescriptionLongHTML
                .slice(0, 100)
                .replace(/(<([^>]+)>)/gi, '')}...`;
        } else {
          return null;
        }
      },
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
      cell: (item: any) =>
        item.isActive ? (
          <>
            <button
              className='btn'
              onClick={() =>
                history.push('/newsForm', { id: item.id, view: 'viewOnly' })
              }
            >
              <img alt='' src={viewIcon} />
            </button>

            <button
              className='btn edit-i'
              onClick={() => history.push('/newsForm', { id: item.id })}
            >
              <img alt='' src={editIcon} />
            </button>
            <button
              className='btn delete-i'
              onClick={(event) => Delete(event, item.id)}
            >
              <img alt='' src={deleteIcon} />
            </button>
          </>
        ) : null,
    },
  ];
  const addnew = () => {
    return (
      limit > newlist.length && (
        <Link
          className='mt-m font-chng mr10 btn btn-secondary'
          to='/newsForm'
          style={{
            backgroundColor: 'rgb(25, 216, 149)',
            border: 'none',
            borderRadius: '30px',
          }}
        >
          <img alt='' src={plusImg} className='pe-2' />
          Add New
        </Link>
      )
    );
  };
  async function getSettings() {
    const response = await SettingsService.getWebsiteSettingsDataInfo();
    if (response && response.data) {
      let temp = response.data.find((item) => {
        if (item.settingKey == 'NewsCountLimit' && item.isEnabled) return item;
      });
      temp !== undefined && setlimit(parseInt(temp.settingValue));
    }
  }
  useEffect(() => {
    getSettings();
  }, []);
  return (
    <div>
      {/* Content */}
      <div className='content'>
        {/* card */}
        <div className='card'>
          <div className='card-header'>
            <div className='row'>
              <div className='col-md-9'>
                <h5 className='cardtitlenew'>Latest News</h5>
              </div>
              <div className='col-md-3 text-right'>{addnew()}</div>
              {/* <p className="card-subtitle">List</p> */}
            </div>
          </div>

          {/* table */}
          <div className='card-body '>
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={newlist}
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

export default WebsiteNewsList;

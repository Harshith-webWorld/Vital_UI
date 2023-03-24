import React, { useState, useEffect } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import VideoServices from '../../../helpers/services/website-videos.service';
import history from '../../../helpers/history';
import plusImg from '../../assets/images/add_new.png';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SettingsService from '../../../helpers/services/website-settings.service';
import { ADDRGETNETWORKPARAMS } from 'dns';

const WebsiteVideoList: React.FC = () => {
  const [videoList, setvideoList] = useState<any>([]);
  const [limit, setlimit] = React.useState<any>(0);

  useEffect(() => {
    getvideoList();
  }, []);

  async function getvideoList() {
    const response = await VideoServices.getVideoInfo();
    if (response && response.data) {
      setvideoList(response.data);
      getSettings();
    }
  }

  const onVideoRemove = async (event: any, id: any) => {
    event.persist();
    const response = await VideoServices.deleteVideoInfo(id);
    getvideoList();
  };

  const Delete = (event: any, id: any) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onVideoRemove(event, id);
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
      selector: 'videoHeader',
    },
    {
      name: 'Description',
      selector: 'videoHtmlText',
      format: (row) =>
        row.videoHtmlText.length < 100
          ? row.videoHtmlText.replace(/(<([^>]+)>)/gi, '')
          : `${row.videoHtmlText
              .slice(0, 100)
              .replace(/(<([^>]+)>)/gi, '')}...`,
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
                history.push('/AddVideoForm', { id: row.id, view: 'viewOnly' })
              }
            >
              <img alt='' src={viewIcon} />
            </button>
            <button
              className='btn'
              onClick={() => history.push('/AddVideoForm', { id: row.id })}
            >
              <img alt='' src={editIcon} />
            </button>
            <button className='btn' onClick={(e: any) => Delete(e, row.id)}>
              <img alt='' src={deleteIcon} />
            </button>
          </>
        ) : null,
    },
  ];

  async function getSettings() {
    const response = await SettingsService.getWebsiteSettingsDataInfo();
    if (response && response.data) {
      let temp = response.data.find((item) => {
        if (item.settingKey == 'VideoCountLimit' && item.isEnabled == true)
          return item;
      });
      temp !== undefined && setlimit(parseInt(temp.settingValue));
    }
  }
  const addnew = () => {
    return (
      limit > videoList.length && (
        <Link
          className='mt-m font-chng mr10 btn btn-secondary'
          style={{
            backgroundColor: 'rgb(25, 216, 149)',
            border: 'none',
            borderRadius: '30px',
          }}
          to='/AddVideoForm'
        >
          <img alt='' src={plusImg} className='pe-2' />
          Add New
        </Link>
      )
    );
  };
  return (
    <div className='content'>
      <div className='card'>
        <div className='card-header'>
          <div className='row'>
            <div className='col-md-9'>
              <h5 className='cardtitlenew font-chng'>Videos</h5>
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
              data={videoList}
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
  );
};

export default WebsiteVideoList;

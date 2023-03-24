import React, { useEffect, useState } from 'react';
import '../../assets/scss/admin.scss';
import SettingsService from '../../../helpers/services/website-settings.service';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import history from '../../../helpers/history';
import plusImg from '../../assets/images/add_new.png';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import moment from 'moment';

const ListMenu: React.FC<any> = () => {
  let WebsiteOthersSettings = [];
  const [settingsList, setsettingsList] = React.useState<any>(
    WebsiteOthersSettings,
  );

  async function getSettings() {
    const response = await SettingsService.getWebsiteSettingsDataInfo();
    if (response && response.data) {
      WebsiteOthersSettings = response.data;
      setsettingsList(response.data);
    }
  }

  async function DeleteMenu(id: number) {
    const response = await SettingsService.deleteWebsiteSettingsData(id);
    if (response.message == 'Deleted successfully') {
      getSettings();
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
            DeleteMenu(id);
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
      name: 'Setting Key',
      selector: 'settingKey',
    },
    {
      name: 'Setting Value',
      selector: 'settingValue',
    },
    {
      name: 'Setting Unit',
      selector: 'settingUnit',
    },

    {
      name: 'Date Of Submission',
      selector: (row: any) => <div>{moment(row.createdAt).format('DD/MM/YYYY')}</div>,
    },
    {
      name: 'Last Modified',
      selector: (row: any) => <div>{moment(row.updatedAt).format('DD/MM/YYYY')}</div>,
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
                history.push('/addsiteSettings', {
                  id: item.id,
                  view: 'viewOnly',
                })
              }>
              <img src={viewIcon} />
            </button>
            <button
              className='btn edit-i'
              onClick={() =>
                history.push('/addsiteSettings', { id: item.id, edit: 'edit' })
              }>
              <img src={editIcon} />
            </button>
            <button
              className='btn delete-i'
              onClick={(event) => Delete(event, item.id)}>
              <img src={deleteIcon} />
            </button>
          </>
        ) : null,
    },
  ];
  useEffect(() => {
    getSettings();
  }, []);
  return (
    <div>
      <div className='content'>
        <div className='card'>
          <div className='card-header'>
            <div className='row'>
              <div className='col-md-9'>
                <h5 className='cardtitlenew'>Site Settings</h5>
              </div>
              <div className='col-md-3 text-right'></div>
            </div>
          </div>

          <div className='card-body '>
          <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={settingsList}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListMenu;

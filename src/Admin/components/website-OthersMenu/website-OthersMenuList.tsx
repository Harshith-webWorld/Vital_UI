import React, { useEffect, useState } from 'react';
import '../../assets/scss/admin.scss';
import Table from 'react-bootstrap/Table';
import MenusService from '../../../helpers/services/website-otherMenu.service';
import { WebsiteOthersMenu } from '../../../helpers/interfaces/website-othersMenu';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../helpers/config';
import { confirmAlert } from 'react-confirm-alert';
import history from '../../../helpers/history';
import plusImg from '../../assets/images/add_new.png';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import moment from 'moment';

const ListMenu: React.FC<any> = () => {
  let WebsiteOthersMenus: WebsiteOthersMenu[] = [];
  const [menuList, setMenuList]: [
    WebsiteOthersMenu[],
    (menuList: WebsiteOthersMenu[]) => void,
  ] = React.useState(WebsiteOthersMenus);

  useEffect(() => {
    getMenus();
  }, []);

  async function getMenus() {
    const response = await MenusService.getWebsiteOtherMenuInfo();
    if (response && response.data) {
      WebsiteOthersMenus = response.data;
      setMenuList(response.data);
    }
  }

  async function DeleteMenu(id: number) {
    const response = await MenusService.deleteWebsiteOtherMenu(id);
    if (response.message == 'Deleted successfully') {
      getMenus();
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
          onClick: () => { },
        },
      ],
    });
  };

  const columns = [
    {
      name: 'Menu Type',
      selector: 'menuType',
    },
    {
      name: 'Page Title',
      selector: 'menuPageTitle',
    },

    {
      name: 'Menu Content HTML',
      selector: 'menuContentHTML',
      format: row => row.menuContentHTML.length < 100 ? row.menuContentHTML :`${row.menuContentHTML.slice(0, 100)}...`

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
                history.push('/addMenu', { id: item.id, view: 'viewOnly' })
              }>
              <img src={viewIcon} />
            </button>
            <button
              className='btn edit-i'
              onClick={() =>
                history.push('/addMenu', { id: item.id, edit: 'edit' })
              }>
              <img src={editIcon} />
            </button>
            {/* <button
              className='btn delete-i'
              onClick={(event) => Delete(event, item.id)}>
              <img src={deleteIcon} />
            </button> */}
          </>
        ) : null,
    },
  ];
  return (
    <div>
      {/* Content */}
      <div className='content'>
        {/* card */}
        <div className='card'>
          <div className='card-header'>
            <div className='row'>
              <div className='col-md-9'>
                <h5 className='cardtitlenew'>Other Menus</h5>
              </div>
              <div className='col-md-3 text-right'>
                {/* <Link className='btn btn-secondary' to='/addMenu'>
                  <img src={plusImg} className='pe-2' />
                  Add New
                </Link> */}
              </div>
            </div>
          </div>

          <div className='card-body '>
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={menuList}
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
                    }
                  }
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

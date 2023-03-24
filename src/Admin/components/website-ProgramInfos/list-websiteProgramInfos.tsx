import React, { useState, useEffect } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import ProgramInfoServices from '../../../helpers/services/website-programInfos.service';
import history from '../../../helpers/history';
import plusImg from '../../assets/images/add_new.png';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const WebsiteProgramInfosList: React.FC = () => {
  const [programInfoList, setProgramInfoList] = useState([]);

  useEffect(() => {
    getProgramInfosList();
  }, []);

  async function getProgramInfosList() {
    const response = await ProgramInfoServices.getProgramInfosInfo();
    if (response) {
      var bloglist = response.data;
      setProgramInfoList(response.data);
    }
  }

  const onProgramInfoRemove = async (event: any, id: any) => {
    event.persist();
    const response = await ProgramInfoServices.deleteProgramInfosInfo(id);
    getProgramInfosList();
  };

  const Delete = (event: any, id: any) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onProgramInfoRemove(event, id);
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
      selector: 'programInfoHeader',
    },
    {
      name: 'Short Description',
      selector: 'programInfoDescriptionShortHTML',
      format: (row) =>
        row.programInfoDescriptionShortHTML.length < 100
          ? row.programInfoDescriptionShortHTML.replace(/(<([^>]+)>)/gi, '')
          : `${row.programInfoDescriptionShortHTML
              .slice(0, 100)
              .replace(/(<([^>]+)>)/gi, '')}...`,
    },
    {
      name: 'Long Description',
      selector: 'programInfoDescriptionLongHTML',
      format: (row) =>
        row.programInfoDescriptionLongHTML.length < 100
          ? row.programInfoDescriptionLongHTML.replace(/(<([^>]+)>)/gi, '')
          : `${row.programInfoDescriptionLongHTML
              .slice(0, 100)
              .replace(/(<([^>]+)>)/gi, '')}...`,
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
                history.push('/programInfosForm', {
                  id: row.id,
                  view: 'viewOnly',
                })
              }
            >
              <img src={viewIcon} />
            </button>
            <button
              className='btn'
              onClick={() => history.push('/programInfosForm', { id: row.id })}
            >
              <img src={editIcon} />
            </button>
            {/* <button className="btn" onClick={(e: any) => Delete(e, row.id)}>
              <img src={deleteIcon} />
            </button> */}
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
                <h4 className='cardtitlenew'>Program Information</h4>
              </div>
              <div className='col-md-3 text-right'>
                {/* <Link className='btn btn-secondary' to='/programInfosForm'>
                  <img src={plusImg} className='pe-2' />
                  Add New
                </Link> */}
              </div>
            </div>
          </div>
          <div className='card-body'>
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={programInfoList}
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

export default WebsiteProgramInfosList;

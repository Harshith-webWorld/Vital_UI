import React, { useEffect } from 'react';
import '../../assets/scss/admin.scss';
import ImagesService from '../../../helpers/services/website-images.service';
import { WebsiteContentImages } from '../../../helpers/interfaces/websitecontent-images';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import history from '../../../helpers/history';
import SettingsService from '../../../helpers/services/website-settings.service';
import plusImg from '../../assets/images/add_new.png';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import moment from 'moment';

const WebsiteImageList: React.FC<any> = () => {
  const [limit, setlimit] = React.useState<any>(0);

  let WebsiteContentImages: WebsiteContentImages[] = [];
  const [imagelist, setImagelist]: [
    WebsiteContentImages[],
    (newlist: WebsiteContentImages[]) => void
  ] = React.useState(WebsiteContentImages);

  useEffect(() => {
    getImages();
  }, []);

  async function getImages() {
    const response = await ImagesService.getImagesInfo();
    if (response && response.data) {
      WebsiteContentImages = response.data;
      setImagelist(response.data);
      getSettings();
    }
  }

  async function DeleteImage(id: number) {
    const response = await ImagesService.deleteImageInfo(id);
    if (response.message == 'Deleted successfully') {
      getImages();
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
            DeleteImage(id);
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
      selector: 'imageHeader',
    },
    {
      name: 'Description',
      selector: 'imageHtmlText',
      format: (row) =>
        row.imageHtmlText.length < 100
          ? row.imageHtmlText.replace(/(<([^>]+)>)/gi, '')
          : `${row.imageHtmlText
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
      cell: (item: any) =>
        item.isActive ? (
          <>
            <button
              className='btn'
              onClick={() =>
                history.push('/imageForm', { id: item.id, view: 'viewOnly' })
              }
            >
              <img src={viewIcon} />
            </button>
            <button
              className='btn edit-i'
              onClick={() => history.push('/imageForm', { id: item.id })}
            >
              <img src={editIcon} />
            </button>
            <button
              className='btn delete-i'
              onClick={(event) => Delete(event, item.id)}
            >
              <img src={deleteIcon} />
            </button>
          </>
        ) : null,
    },
  ];
  const addnew = () => {
    return (
      limit > imagelist.length && (
        <Link
          className='mt-m font-chng mr10 btn btn-secondary'
          to='/imageForm'
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
        if (item.settingKey == 'BannerCountLimit' && item.isEnabled)
          return item;
      });
      temp !== undefined && setlimit(parseInt(temp.settingValue));
    }
  }

  return (
    <div>
      {/* Content */}
      <div className='content'>
        {/* card */}
        <div className='card'>
          <div className='card-header'>
            <div className='row'>
              <div className='col-md-9'>
                <h5 className='cardtitlenew font-chng'>Banner Images</h5>
              </div>
              <div className='col-md-3 text-right'>{addnew()}</div>
            </div>
          </div>

          <div className='card-body '>
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={imagelist}
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

export default WebsiteImageList;

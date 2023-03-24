import React, { useEffect, useState } from "react";
import "../../assets/scss/admin.scss";
import Table from "react-bootstrap/Table";
import NewsService from "../../../helpers/services/website-news.service";
import { WebsiteContentNews } from "../../../helpers/interfaces/websitecontent-news";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../helpers/config";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import DataTable from "react-data-table-component";
import history from "../../../helpers/history";
import Button from "react-bootstrap/Button";
import plusImg from "../../assets/images/add_new.png";
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import moment from "moment";
import talukaService from "../../../helpers/services/talukaService";

const Talukas = () => {
  const [talukaList, settalukaList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  useEffect(() => {
    gettalukaList();
    getStateList();
    getDistrictInfoForTaluka();
  }, []);

  async function getStateList() {
    const response = await talukaService.getStateForTaluka();
    if (response && response.data) {
      setStateList(response.data);
    }
  }

  async function gettalukaList() {
    const response = await talukaService.gettaluka();
    if (response && response.data) {
      settalukaList(response.data);
    }
  }

  async function getDistrictInfoForTaluka() {
    const response = await talukaService.getDistrictInfoForTaluka();
    if (response && response.data) {
      setDistrictList(response.data);
    }
  }

  const stateExtractor = (stateList, id) => {
    var result = stateList.filter((obj) => {
      return obj.id === id;
    });

    return result.length === 0 ? "nill" : result[0].stateName;
  };

  const districtExtractor = (districtList, id) => {
    var result = districtList.filter((obj) => {
      return obj.id === id;
    });

    return result.length === 0 ? "nill" : result[0].districtName;
  };


  const columns = [
    {
      name: "Taluka Name",
      selector: "talukaName",
    },
    {
      name: "District",
      selector: (row: any) => (
        <div>{districtExtractor(districtList, row.districtId)}</div>
      ),
    },
    {
      name: "State",
      selector: (row: any) => (
        <div>{stateExtractor(stateList, row.stateId)}</div>
      ),
    },
    {
      name: "Last Modified",
      selector: (row: any) => <div>{moment(row.updatedAt).format("DD/MM/YYYY")}</div>,
    },
    {
      name: "Actions",
      button: true,
      cell: (item: any) =>
        item.isActive ? (
          <>
            <button
              className="btn"
              onClick={() =>
                history.push("/talukaForm", { id: item.id, view: "viewOnly" })
              }
            >
              <img src={viewIcon} alt="viewIcon" />
            </button>

            <button
              className="btn edit-i"
              onClick={() => history.push("/talukaForm", { id: item.id })}
            >
              <img src={editIcon} alt="editIcon" />
            </button>
            <button
              className="btn delete-i"
            //   onClick={(event) => Delete(event, item.id)}
            >
              <img src={deleteIcon} alt="deleteIcon" />
            </button>
          </>
        ) : null,
    },
  ];

  return (
    <div>
      {/* Content */}
      <div className="content">
        {/* card */}
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-md-9">
                <h5 className="cardtitlenew">Talukas</h5>
              </div>
              <div className="col-md-3 text-right">
                <Link
                  className="mt-m font-chng mr10 btn btn-secondary"
                  style={{ backgroundColor: "rgb(25, 216, 149)", border: "none", borderRadius: "30px" }}
                  to="/talukaForm">
                  <img src={plusImg} className="pe-2" alt={"plus logo"} />
                  Add New
                </Link>
              </div>
            </div>
          </div>

          {/* table */}
          <div className="card-body ">
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={talukaList}
                highlightOnHover
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationComponentOptions={{
                  rowsPerPageText: "Records per page:",
                  rangeSeparatorText: "out of",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Talukas;
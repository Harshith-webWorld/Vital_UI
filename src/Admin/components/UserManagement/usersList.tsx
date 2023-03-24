import React, { useState, useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import plusImg from "../../assets/images/add_new.png";
import usersService from "../../../helpers/services/userService";
import history from '../../../helpers/history';
// import viewIcon from '../../assets/images/view_icon.png';
// import editIcon from '../../assets/images/Edit_icon.png';
// import deleteIcon from '../../assets/images/delete_icon.png';
import viewIcon from '../../assets/images/view.png';
import editIcon from '../../assets/images/pencilicon.png';
import deleteIcon from '../../assets/images/closeicon.png';
import { Link } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const WebsiteFaqsList: React.FC = () => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    getUsersList();
  }, []);

  async function getUsersList() {
    const response = await usersService.getUsersList();
    if (response) {
      setUsersList(response.data);
    }
  }

  const onUsersRemove = async (id: any) => {

    const response = await usersService.deleteUsers(id);
    if (response.message == "Deleted successfully") {
      getUsersList();
    };
  }

  const Delete = (event: any, id: any) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: "Do you want to delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            onUsersRemove(id);
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  const columns = [
    {
      name: "UserName",
      selector: "userName",
    },
    {
      name: "FullName",
      selector: "fullName",
    },
    {
      name: "Email",
      selector: "email",
    },
    {
      name: "Mobile Number",
      selector: "mobileNumber",
    },
    {
      name: "Actions",
      button: true,
      cell: (row: any) =>

        <>
          <button
            className="btn"
            onClick={() =>
              history.push("/users", { id: row.id, view: "viewOnly" })
            }
          >
            <img src={viewIcon} />
          </button>
          <button
            className="btn"
            onClick={() => history.push("/users", { id: row.id })}
          >
            <img src={editIcon} />
          </button>
          <button className="btn" onClick={(e: any) => Delete(e, row.id)}>
            <img src={deleteIcon} />
          </button>

        </>

    },
  ];

  return (
    <div>
      <div className="content">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-md-9">
                <h4 className="cardtitlenew font-chng">Users</h4>
              </div>
              <div className="col-md-3 text-right">
                <Link
                  className="mt-m font-chng mr10 btn btn-secondary"
                  style={{ backgroundColor: "rgb(25, 216, 149)", border: "none", borderRadius: "30px" }}
                  to="/users">
                  <img src={plusImg} className="pe-2" /> Add New

                </Link>

              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="post-tablenew font-chng cus-table">
              <DataTable
                columns={columns}
                data={usersList}
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

export default WebsiteFaqsList;

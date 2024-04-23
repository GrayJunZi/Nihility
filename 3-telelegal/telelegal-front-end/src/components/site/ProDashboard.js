import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import socketConnection from "../../utilities/socketConnection";
import proSocketListeners from "../../utilities/proSocketListeners";
import moment from "moment";
import "./ProDashboard.css";

const ProDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptInfo, setApptInfo] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // 从URL的 Query String 中获取Token内容
    const token = searchParams.get("token");
    const socket = socketConnection(token);
    proSocketListeners(socket, setApptInfo, dispatch);
  }, [searchParams]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 main-border purple-bg"></div>
      </div>
      <div className="row">
        <div className="col-3 purple-bg left-rail text-center">
          <i className="fa fa-user mb-3"></i>
          <div className="menu-item active">
            <li>
              <i className="fa fa-table-columns"></i>Dashboard
            </li>
          </div>
          <div className="menu-item">
            <li>
              <i className="fa fa-calendar"></i>Calendar
            </li>
          </div>
          <div className="menu-item">
            <li>
              <i className="fa fa-gear"></i>Settings
            </li>
          </div>
          <div className="menu-item">
            <li>
              <i className="fa fa-file-lines"></i>Files
            </li>
          </div>
          <div className="menu-item">
            <li>
              <i className="fa fa-chart-pie"></i>Reports
            </li>
          </div>
        </div>
        <div className="col-8">
          <div className="row">
            <h1>Dashboard</h1>
            <div className="row num-1">
              <div className="col-6">
                <div className="dash-box clients-board orange-bg">
                  <h4>Clients</h4>
                  <li className="client">Jim Jones</li>
                </div>
              </div>
              <div className="col-6">
                <div className="dash-box clients-board blue-bg">
                  <h4>Coming Appointments</h4>
                  {apptInfo.map((x) => (
                    <div key={x.uuid}>
                      <li className="client">
                        {x.clientName} - {moment(x.apptDate).calendar()}
                        {x.waiting ? (
                          <>
                            <div className="waiting-text d-inline-block">
                              Waiting
                            </div>
                            <button className="btn btn-danger join-btn">
                              Join
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </li>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row num-2">
              <div className="col-6">
                <div className="dash-box clients-board green-bg">
                  <h4>Files</h4>
                  <div className="pointer">
                    <i className="fa fa-plus"></i>{" "}
                    <i className="fa fa-folder"></i>
                  </div>
                  <div className="pointer">
                    <i className="fa fa-plus"></i> file
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="dash-box clients-board redish-bg">
                  <h4>Analytics</h4>
                  <div className="text-center">
                    <img src="https://s3.amazonaws.com/robertbunch.dev.publicresources/722443_infographic07.jpg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row num-2">
            <div className="col-4 calendar">
              <img src="https://s3.amazonaws.com/robertbunch.dev.publicresources/calendar.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;

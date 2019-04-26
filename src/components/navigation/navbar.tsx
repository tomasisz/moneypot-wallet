import React, { useEffect, useState } from "react";
import './navbar.scss';
import { Link, withRouter } from 'react-router-dom'


export default withRouter(NavBar)

function NavBar(props: any) {


  const [isDashboardHover, setIsDashboardHover] = useState(false);
  const dashboardHover = { onMouseEnter: () => setIsDashboardHover(true), onMouseLeave: () => setIsDashboardHover(false) };

  const [isReceiveBitcoinHover, setIsReceiveBitcoinHover] = useState(false);
  const receiveBitcoinHover = { onMouseEnter: () => setIsReceiveBitcoinHover(true), onMouseLeave: () => setIsReceiveBitcoinHover(false) };

  const [isReceiveDirectHover, setIsReceiveDirectHover] = useState(false);
  const receiveDirectHover = { onMouseEnter: () => setIsReceiveDirectHover(true), onMouseLeave: () => setIsReceiveDirectHover(false) };

  const [isSendHover, setIsSendHover] = useState(false);
  const sendHover = { onMouseEnter: () => setIsSendHover(true), onMouseLeave: () => setIsSendHover(false) };

  const [isHistoryHover, setIsHistoryHover] = useState(false);
  const historyHover = { onMouseEnter: () => setIsHistoryHover(true), onMouseLeave: () => setIsHistoryHover(false) };
  
  function NavLink(props: any) {

      let isActive = props.path === props.to;
      let activeId = isActive ? 'active-nav' : '';


      return(
        <Link id={activeId} {...props}/>

      );

  }
  let hoverDashboardClassName = isDashboardHover ? 'dashboard-hover' : '';
  let hoverReceiveBitcoinClassName = isReceiveBitcoinHover ? 'receive-bitcoin-hover' : '';
  let hoverReceiveDirectClassName = isReceiveDirectHover ? 'receive-direct-hover' : '';
  let hoverSendClassName = isSendHover ? 'send-hover' : '';
  let hoverHistoryClassName = isHistoryHover ? 'history-hover' : '';

  return (
            <div className="custom-navbar">
              {props.isMobile? '' : <div><Link className="navbar-brand" to="/">hookedin</Link><p>v 0.1</p></div>}
              <NavLink to="/" path={props.location.pathname} className={hoverDashboardClassName} {...dashboardHover}>
                <div className="navbar-img-container dashboard" ></div>
                <span className="navbar-link-text">Dashboard</span>
              </NavLink>
              <NavLink path={props.location.pathname} to="/receive/bitcoin" className={hoverReceiveBitcoinClassName} {...receiveBitcoinHover}>
                <div className="navbar-img-container receive-bitcoin"></div>
                <span className="navbar-link-text">Receive Bitcoin</span>
              </NavLink>
              <NavLink path={props.location.pathname} to="/receive/direct" className={hoverReceiveDirectClassName} {...receiveDirectHover}>
                <div className="navbar-img-container receive-direct"></div>
                <span className="navbar-link-text">Receive Direct</span>
              </NavLink>
                <NavLink path={props.location.pathname} to="/send" className={hoverSendClassName} {...sendHover}>
                  <div className="navbar-img-container send"></div>
                  <span className="navbar-link-text">Send</span>
                </NavLink>
                <NavLink path={props.location.pathname} to="/history" className={hoverHistoryClassName} {...historyHover}>
                  <div className="navbar-img-container history"></div>
                  <span className="navbar-link-text">History</span>
                </NavLink>
            </div>
        );
}


import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Menu from '../menu/menu'
import MsgCopy from '../micro-components/msg-copy'
import LeftSide from './left-side'
import RightSide from './right-side'
import CopieParagraph from '../data-view/copie-paragraph'
import DataBoxCloud from '../data-view/data-box-cloud'
import DataUpdateKnow from '../data-view/data-update-know'
import api from '../../utils/api'

const Layout = ({ children, toggle }) => {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(undefined)
  const [showMsg, setShowMsg] = useState(false)
  const [activaMenu, setactivaMenu] = useState(false)
  const [API_LastUpdated, SetAPI_LastUpdated] = useState(null)
  const [address, setAddress] = useState('')
  const [channel, setChannel] = useState('')
  const [hash, setHash] = useState('')

  const copyCodeToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    showCopyCode();
  }

  const showCopyCode = () => {
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 800);
  }

  const changeThemeMode = () => {
    if (darkMode !== undefined) {
      if (darkMode) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
    }
  }

  useEffect(() => {
    if (toggle) {
      showCopyCode();
    }
  }, [toggle]);

  useEffect(() => {
    if (darkMode !== undefined) {
      localStorage.setItem('darkMode', darkMode)
      changeThemeMode()
    }
  }, [darkMode])

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getAllData()
      if (response.data) {
        let CleanDate = response.data.refreshed.slice(0, -5)
        SetAPI_LastUpdated(CleanDate)
        setAddress('0x6f80d1a3ab9006548c2fbb180879b87364d63bf7')
        setChannel('0x3Cd4B4D97dCad4eE772BC4f0fB0e7605fC86A85b')
        setHash(response.data.address)
      }
    }
    fetchData()

    let oValue = localStorage.getItem('darkMode')
    if (oValue) {
      setDarkMode(oValue === 'true')
    }
  }, [])

  return (
    <>
      <Head>
        <title>hopr</title>
      </Head>
      <header>
        <nav className="navbar only-mobile-view">
          <div className="icon-logo">
            <img
              src={'/assets/brand/' + (darkMode ? 'logo_white.svg' : 'logo.svg')}
              className={activaMenu ? 'open' : ''}
              alt="hopr"
            />
          </div>
          <div className={'icon-menu ' + (activaMenu ? 'open' : '')} onClick={() => setactivaMenu(!activaMenu)}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
        <div className="only-desktop-view">
          <div className="icon-logo-desktop">
            <a href="https://hoprnet.org/" target="_blank" rel="noopener noreferrer">
              <img src={'/assets/brand/' + (darkMode ? 'logo_white.svg' : 'logo.svg')} alt="hopr" />
            </a>
          </div>
          <div className="active-darkmode">
            <label className="switch">
              <input type="checkbox" onChange={(event) => setDarkMode(event.target.checked)} checked={darkMode ? true : false } />
              <span className="slider round">
                <img
                  className="icon-darkmode"
                  src={'/assets/icons/' + (darkMode ? 'luna.svg' : 'dom.svg')}
                  alt="hopr darkmode"
                />
              </span>
            </label>
          </div>
        </div>
        <MsgCopy showMsg={showMsg}/>
      </header>
      <Menu
        darkMode={darkMode}
        changeThemeMode={changeThemeMode}
        activaMenu={activaMenu}
        hash={hash}
        copyCodeToClipboard={copyCodeToClipboard}
      />
      <div className="main-container">
        <div className="only-desktop-view">
          <LeftSide
            darkMode={darkMode}
            hash={hash}
            copyCodeToClipboard={copyCodeToClipboard}
          />
        </div>
        <section className={'about only-mobile-view ' + (router.pathname != '/' ? 'aux-margin' : '')}>
          <div className={(router.pathname != '/' ? 'only-desktop-view' : '')}>
            <CopieParagraph />
          </div>
        </section>
        {children}
        <section className="only-mobile-view">
          <hr />
          <DataBoxCloud
            address={address}
            channel={channel}
            copyCodeToClipboard={copyCodeToClipboard}
          />
          <hr />
          <DataUpdateKnow API_LastUpdated={API_LastUpdated} />
          <hr />
          <p className="paragraph-copy ">
            Thanks for helping us create the <span> HOPR network. </span>
          </p>
        </section>
        <RightSide
          address={address}
          channel={channel}
          API_LastUpdated={API_LastUpdated}
          copyCodeToClipboard={copyCodeToClipboard}
        />
      </div>
    </>
  )
}

export default Layout

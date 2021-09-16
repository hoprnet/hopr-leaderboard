import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout.js";
import { Instructions } from "../components/atoms/Instructions";
import BoxRemember from "../components/micro-components/box-remember";


const Records = ({ records }) => {
  return(<span>
    Total records: {records.length}
  </span>)
}

export default function Help() {
  const [showMsg, setShowMsg] = useState(false);
  const [isLoadingSetOne, setLoadingSetOne] = useState(false);
  const [isLoadingMissingSetOne, setLoadingMissingSetOne] = useState(false);
  const [isLoadingMissingSetThree, setLoadingMissingSetThree] = useState(false);
  const [global, setGlobal] = useState({})
  const [repeated, setRepeated] = useState([])
  const [all, setAll] = useState([])
  const [missingOneAll, setMissingOneAll] = useState([])
  const [missingThreeAll, setMissingThreeAll] = useState([])

  const updateGlobalAndRepeatedWithRecords = (records, endpoint) => {
    records.map( record => {
      if (global[record]) {
        console.log("REPEATED", record);
        repeated.push({ record, endpoint });
        setRepeated(repeated);
      } else {
        global[record] = true;
        setGlobal(global);
      }
    })
  }

  useEffect(() => {
    const loadGetAll = async() => {
      setLoadingSetOne(true)
      const getAllResponse = await (await fetch(`/api/get/all`)).json();
      const all = Object.values(getAllResponse.records)
      setAll(all);
      console.log('[ loadGetAll ] Records from /get/all', all)
      updateGlobalAndRepeatedWithRecords(all, `/api/get/all`)
      setTimeout(() => setLoadingSetOne(false), 1000);
    }
    const loadMissingOne = async() => {
      setLoadingMissingSetOne(true)
      const getMissingOneResponse = await (await fetch(`/api/get/missing/1/all`)).json();
      setMissingOneAll(getMissingOneResponse.addresses)
      console.log('[ loadMissingOne ] Records from /get/missing/1/all', getMissingOneResponse.addresses)
      updateGlobalAndRepeatedWithRecords(missingOneAll, `/api/get/missing/1/all`)
      setTimeout(() => setLoadingMissingSetOne(false), 1000);
    }
    const loadMissingThree = async() => {
      setLoadingMissingSetThree(true)
      const getMissingThreeResponse = await (await fetch(`/api/get/missing/3/all`)).json();
      setMissingThreeAll(getMissingThreeResponse.addresses)
      console.log('[ loadMissingThree ] Records from /get/missing/3/all', getMissingThreeResponse.addresses)
      updateGlobalAndRepeatedWithRecords(missingThreeAll, `/api/get/missing/3/all`)
      setTimeout(() => setLoadingMissingSetThree(false), 1000);
    }
    loadGetAll()
    loadMissingOne()
    loadMissingThree()
    return(() => {
      setAll([]);
      setMissingOneAll([])
      setGlobal({})
      setRepeated([])
    })
  }, [])


  return (
    <>
      <Layout toggle={showMsg}>
        <div className="box help-area" style={{ height: "auto"}}>
          <div className="box-top-area">
            <div>
              <div className="box-title">
                <h1>Sanity check.</h1>
              </div>
              <div className="box-btn">
                <p>v0.01</p>
              </div>
            </div>
          </div>
          <br/>
          <div className="box-main-area">
          {
            [
             { endpoint: '/api/get/all', records: all }, 
             { endpoint: '/api/get/missing/1/all', records: missingOneAll},
             { endpoint: '/api/get/missing/3/all', records: missingThreeAll}
            ].map(checks => (
              <>
              <p><code>{checks.endpoint}</code></p>
              <small>{ isLoadingSetOne ? 'Loading set one...' : <Records records={checks.records} /> }</small>
              </>
            ))
          }
          <br/>
          <br/>
          <b>Repeated</b>
          <p>Total repeated <code>{repeated.length}</code></p>
          <br/>
          <br/>
          <b>Total ETH Addresses</b>
          <p>Total unique addresses <code>{all.length + missingOneAll.length + missingThreeAll.length }</code></p>
          </div>
        </div>
      </Layout>
    </>
  );
}

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

  const updateGlobalAndRepeatedWithRecords = (global, repeated, records, endpoint) => {
    records.map(record => {
      if (global[record]) {
        console.log("REPEATED", record, endpoint);
        repeated.push({ record, endpoint });
      } else {
        console.log(`Unique, currently ${Object.keys(global).length}`)
        global[record] = true;
      }
    })
  }

  useEffect(() => {
    
    const loadGetAll = async(global, repeated) => {
      const endpoint = `/api/get/dune/all`
      setLoadingSetOne(true)
      const getAllResponse = await (await fetch(endpoint)).json();
      const all = getAllResponse.ethAddresses
      setAll(all);
      console.log('[ loadGetAll ] Records from',endpoint, all)
      updateGlobalAndRepeatedWithRecords(global, repeated, all, endpoint)
      setTimeout(() => setLoadingSetOne(false), 1000);
    }
    const loadMissingOne = async(global, repeated) => {
      const endpoint = `/api/get/dune/missing/1/all`
      setLoadingMissingSetOne(true)
      const getMissingOneResponse = await (await fetch(endpoint)).json();
      const missingOneAll = getMissingOneResponse.ethAddresses
      setMissingOneAll(missingOneAll)
      console.log('[ loadMissingOne ] Records from',endpoint, missingOneAll)
      updateGlobalAndRepeatedWithRecords(global, repeated, missingOneAll, endpoint)
      setTimeout(() => setLoadingMissingSetOne(false), 1000);
    }
    const loadMissingThree = async(global, repeated) => {
      const endpoint = `/api/get/dune/missing/3/all`
      setLoadingMissingSetThree(true)
      const getMissingThreeResponse = await (await fetch(endpoint)).json();
      const missingThreeAll = getMissingThreeResponse.ethAddresses;
      setMissingThreeAll(missingThreeAll)
      console.log('[ loadMissingThree ] Records from', endpoint,missingThreeAll)
      updateGlobalAndRepeatedWithRecords(global, repeated, missingThreeAll, endpoint)
      setTimeout(() => setLoadingMissingSetThree(false), 1000);
    }
    const loadAll = async() => {
      let global = {};
      let repeated = [];
      await loadGetAll(global, repeated)
      await loadMissingOne(global, repeated)
      await loadMissingThree(global, repeated)
      setGlobal(global);
      setRepeated(repeated);
    }
    loadAll()
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

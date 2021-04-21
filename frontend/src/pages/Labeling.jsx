import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'react-bootstrap-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useParams } from 'react-router-dom';
import HTTPLauncher from '../services/HTTPLauncher';
import DocumentClassification from '../components/DocumentClassification';
import Sequence from '../components/Sequence';
import FinishedPopUp from '../components/FinishedPopUp';
import '../css/Labeling.css';

// Labeling-page handles labeling functionality
const Labeling = () => {
  const [dataCounter, setDataCounter] = useState(0);
  const [finished, setFinished] = useState(false);

  const projectId = useParams().id;
  const type = useParams().projectType;
  const [listOfDataPoints, setListOfDataPoints] = useState([]);

  // changes the counter which keeps track off what datapoint to show
  function changeData(count) {
    setDataCounter(count);
  }

  // Gets 5 new datapoints from database, runs when entering a project
  async function fetchdata() {
    const response = await HTTPLauncher.sendGetData(projectId, 5);
    if (Object.keys(response.data).length === 0) {
      setFinished(true);
    }

    // create Array of arrays from object with key and value pair
    const dataArray = Object.entries(response.data);
    setListOfDataPoints(dataArray);
    changeData(dataCounter);
  }

  // Temporary function to add testdata to projects *TODO*: delete
  async function testAddData() {
    const response = await HTTPLauncher.sendAddNewTextData(
      projectId,
      JSON.stringify([
        {
          text: 'Data nummer 1',
          labels: [],
        },
        {
          text: 'Data nummer 2',
          labels: [],
        },
        {
          text: 'Data nummer 3',
          labels: [],
        },
        /* {
          text: 'Data nummer 4',
          labels: [],
        },
        {
          text: 'Data nummer 5',
          labels: [],
        },
        {
          text: 'Data nummer 6',
          labels: [],
        },
        {
          text: 'Data nummer 7',
          labels: [],
        },
        {
          text: 'Data nummer 8',
          labels: [],
        },
        {
          text: 'Data nummer 9',
          labels: [],
        },
        {
          text: 'Data nummer 10',
          labels: [],
        },
        {
          text: 'Data nummer 11',
          labels: [],
        },
        {
          text: 'Data nummer 12',
          labels: [],
        }, */
      ])
    );
    console.log(response);
  }

  useEffect(() => {
    fetchdata();
    // eslint-disable-next-line
  }, []);

  // Go to next datapoint, and get a new one
  const nextData = async () => {
    // Add check label, if label exist then delete already from list

    // change datacounter
    const tempDataCounter = dataCounter + 1;

    // If there are less than 5 datapoints ahead in the list get a new one

    if (Object.keys(listOfDataPoints).length - 5 < tempDataCounter) {
      const response = await HTTPLauncher.sendGetData(projectId, 1);
      if (Object.keys(response.data).length === 0) {
        setFinished(true);
      }
      const newDataPoint = Object.entries(response.data);
      const tempListOfDataPoints = listOfDataPoints.slice();
      const newListOfDataPoints = tempListOfDataPoints.concat(newDataPoint);
      setListOfDataPoints(newListOfDataPoints);
      changeData(tempDataCounter);
    } else {
      changeData(tempDataCounter);
    }
  };

  const selectProjectComponent = (typeOfProject) => {
    if (listOfDataPoints[dataCounter]) {
      if (typeOfProject === '1') {
        return (
          <DocumentClassification
            data={listOfDataPoints[dataCounter][1]}
            dataPointId={parseInt(listOfDataPoints[dataCounter][0])}
            nextData={nextData}
          />
        );
      }
      if (typeOfProject === '2') {
        return (
          <Sequence
            data={listOfDataPoints[dataCounter][1]}
            dataPointId={parseInt(listOfDataPoints[dataCounter][0])}
          />
        );
      }
    }

    return <div>This should not show</div>;
  };

  // Go to the data before in listOfDataPoints (last shown data)
  const getLastData = async () => {
    if (dataCounter - 1 >= 0) {
      const tempDataCounter = dataCounter - 1;
      changeData(tempDataCounter);
      console.log('Going back!');
      console.log('This is the data that we are displaying: ', listOfDataPoints[tempDataCounter]);
      console.log('Data ID', listOfDataPoints[tempDataCounter][0]);
      console.log('Project ID: ', projectId);
      const response = await HTTPLauncher.sendGetLabel(
        projectId,
        listOfDataPoints[tempDataCounter][0]
      );
      console.log('REPSONSE: ', response);
    } else {
      console.log('This is the first data');
    }

    // hur hämtar man ut en label?
  };

  // temporary help function
  const seelistOfDataPoints = () => {
    console.log(listOfDataPoints);
  };

  // temporary help function
  const seeExportData = async () => {
    const response = await HTTPLauncher.sendGetExportData(projectId);
    console.log(response);
  };

  return (
    <div className="content-container">
      <div className="progress-bars">
        <ProgressBar striped variant="success" now={75} />
        <br />
        <ProgressBar striped variant="warning" now={25} />
      </div>
      <br />
      {!finished ? (
        <div>
          <div className="main-content">
            <ChevronLeft
              className="right-left-arrow  make-large fa-10x arrow-btn"
              onClick={getLastData}
            />

            <div className="data-content">{selectProjectComponent(type)}</div>

            <ChevronRight
              className="right-left-arrow  make-large fa-10x arrow-btn"
              onClick={nextData}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              window.location.href = 'http://localhost:3000/home';
            }}
          >
            Go back
          </button>
          <button type="button" className="btn btn-primary" onClick={seelistOfDataPoints}>
            CurrentDataPoints
          </button>
          <button type="button" className="btn btn-primary" onClick={seeExportData}>
            See exported data
          </button>
        </div>
      ) : (
        <FinishedPopUp />
      )}

      <button type="button" className="btn btn-primary" onClick={testAddData}>
        Add data
      </button>
    </div>
  );
};

export default Labeling;

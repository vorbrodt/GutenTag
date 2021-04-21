import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import HTTPLauncher from '../services/HTTPLauncher';
// import HTTPLauncher from '../services/HTTPLauncher';

const Sequence = ({ data, dataPointId }) => {
  const [labelString, setLabelString] = useState('');
  const inputRef = useRef();
  const [count, setCount] = useState(0);

  const addLabel = () => {
    const labelstring = 'hej';
    const startIndex = 0;
    const endIndex = 2;
    const label = [];
    label.push(startIndex);
    label.push(endIndex);
    label.push(labelstring);
    // HTTPLauncher.sendCreateSequenceLabel(dataPointId, labelString, begin, end);
    console.log(label);
  };

  useEffect(() => {
    inputRef.current.value = '';
    inputRef.current.focus();
  }, [dataPointId]);

  useEffect(() => {
    console.log('now look at this', window.getSelection().toString());
    const markedText = window.getSelection();
    const markedTextRange = markedText.getRangeAt(0);
    const startIndex = markedTextRange.startOffset;
    const endIndex = markedTextRange.endOffset - 1;
    console.log('markedText: ', markedText);
    console.log('markedTextRange: ', markedTextRange);
    console.log('Start : ', startIndex, ' End: ', endIndex);
  }, [count]);

  return (
    <div className="classification-container">
      <div className="text-box-container">
        <p>{data}</p>
      </div>
      <hr className="hr-title" data-content="Suggestions" />
      <h4>Display label suggestions</h4>
      <hr className="hr-title" data-content="Add new label" />
      <button
        className="btn btn-primary"
        type="submit"
        onClick={() => {
          const tempCount = count + 1;
          setCount(tempCount);
        }}
      >
        Select
      </button>
      <div className="form-container">
        <Form onSubmit={addLabel}>
          <Form.Group controlId="form.name" className="form-group">
            <input
              type="text"
              onChange={(event) => setLabelString(event.target.value)}
              placeholder="Enter label..."
              required
              className="input-box"
              ref={inputRef}
            />
            <button className="btn btn-primary label-btn" type="submit">
              Label
            </button>
          </Form.Group>
        </Form>
      </div>
      <hr className="hr-title" data-content="Old labels" />
      <h4>Display old labels</h4>
    </div>
  );
};

Sequence.propTypes = {
  data: PropTypes.string.isRequired,
  dataPointId: PropTypes.number.isRequired,
};
export default Sequence;

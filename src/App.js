import React, {useRef, useEffect, useState} from 'react';
import './App.css';

// Import dependencies

import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Fragment} from "react";


function App() {

  // Setup references ans state hooks

  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  // Load Tensorflow model

  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log('Model Loaded');
  };

  useEffect(() => {loadModel()}, []);

  // Handle Questions

  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null){
      console.log('Question submitted');
      const passage = passageRef.current.value;
      const question = questionRef.current.value;

      const answers = await model.findAnswers(question, passage);
      setAnswer(answers);
      console.log(answers);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        {/* Setup input, question and result area */}
        {
          model == null ?
          <div>
            <div>Model Loading</div>
            <Loader 
              type="Puff"
              color="#008FFF"
              height={100}
              width={100}
            />
          </div>
          :
          <Fragment>
            <div>Passage</div>
            <textarea ref={passageRef} rows="25" cols="100"></textarea>
            <br/>

            <div>Ask a question</div>
            <input ref={questionRef} onKeyPress={answerQuestion} size="80"/>
            <br/>

            <div>Answers</div>
            { answer ?
              answer.map((ans, idx) => 
                <div><b>Answer {idx+1} - {ans.text} - Score({Math.floor(ans.score+100)/100})</b></div>)
            : ""
            }
          </Fragment>
        }
        
      </header>
    </div>
  );
}

export default App;

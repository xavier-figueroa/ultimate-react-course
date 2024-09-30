import { memo, useEffect, useState } from "react";
import clickSound from "./ClickSound.m4a";

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);
  const [manualSeconds, setManualSeconds] = useState(0);

  useEffect(
    function () {
      const playSound = function () {
        if (!allowSound) return;
        const sound = new Audio(clickSound);
        sound.play();
      };

      playSound();
    },
    [allowSound]
  );

  useEffect(
    function () {
      document.title = `Your ${number}-exercise workout`;
    },
    [number]
  );

  const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak + (manualSeconds / 60);
  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  function handleInc(d) {
    const hasDecimals = (d - Math.floor(d)) !== 0;

    if(hasDecimals){
      setManualSeconds(current=> current+30);
    } else {
      setManualSeconds(current=> current+60);
    }
  }

  function handleDec(d) {
    if(d<=.5)
      return;

    const hasDecimals = (d - Math.floor(d)) !== 0;
    if(hasDecimals){
      setManualSeconds(current=> current-30);
    } else {
      setManualSeconds(current=> current-60);
    }
    
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => {
            setNumber(+e.target.value);
            setManualSeconds(0);}
            }>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => {
              setSets(e.target.value);
              setManualSeconds(0);}
            }
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => {
              setSpeed(e.target.value);
              setManualSeconds(0);}}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => {
              setDurationBreak(e.target.value);
              setManualSeconds(0);}
            }
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={ ()=>handleDec(duration) }>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={ ()=>handleInc(duration) }>+</button>
      </section>
    </>
  );
}

export default memo(Calculator);

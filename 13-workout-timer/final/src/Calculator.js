import { memo, useEffect, useReducer } from "react";
import clickSound from "./ClickSound.m4a";

function Calculator({ workouts, allowSound }) {

  function reducer(state, action) {
    switch (action.type) {
      case "setNumber":
        return { ...state, number: action.payload, manualSeconds: 0 };
      case "setSets":
        return { ...state, sets: action.payload, manualSeconds: 0 };
      case "setSpeed":
        return { ...state, speed: action.payload, manualSeconds: 0 };
      case "setDurationBreak":
        return { ...state, durationBreak: action.payload, manualSeconds: 0 }
      case "incManualSeconds":
        const increment = (action.payload - Math.floor(action.payload)) !== 0 ? 30 : 60;
        return { ...state, manualSeconds: state.manualSeconds + increment }
      case "decManualSeconds":
        if (action.payload <= .5)
          return state;

        const decrement = (action.payload - Math.floor(action.payload)) !== 0 ? 30 : 60;
        return { ...state, manualSeconds: state.manualSeconds - decrement }
      default:
        throw new Error("Invalid action" + action.type)
    }

  }
  const initialState = {
    number: workouts.at(0).numExercises,
    sets: 3,
    speed: 90,
    durationBreak: 5,
    manualSeconds: 0
  }
  const [{ number, sets, speed, durationBreak, manualSeconds }, dispatch] = useReducer(reducer, initialState);

  useEffect(
    function () {
      const playSound = function () {
        if (!allowSound) return;
        const sound = new Audio(clickSound);
        sound.play();
      };

      playSound();
    },
    [allowSound, number, sets, speed, durationBreak, manualSeconds]
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

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => dispatch({ type: "setNumber", payload: +e.target.value })} >
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
            onChange={(e) => dispatch({ type: "setSets", payload: e.target.value })}
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
            onChange={(e) => dispatch({ type: "setSpeed", payload: e.target.value })}
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
            onChange={(e) => dispatch({ type: "setDurationBreak", payload: e.target.value })}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={() => dispatch({ type: "decManualSeconds", payload: duration })}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={() => dispatch({ type: "incManualSeconds", payload: duration })}>+</button>
      </section>
    </>
  );
}

export default memo(Calculator);

import { useState, useEffect } from "react";
import couponSVG from './assets/img/coupon.svg';
import resetSVG from './assets/img/recycle.svg';
import codeMapDev from './assets/json/codes_dev.json';
import codeMapProd from './assets/json/codes_prod.json';
import STATIC from "./assets/json/static_text.json";
import './App.scss';
const codeMap = window.location.hostname === "localhost" ? codeMapDev : codeMapProd;
let confettiCreated = [];
const createConfetti = target => {
  const random = max => {
    return Math.random() * (max - 0) + 0;
  }

  var c = document.createDocumentFragment();
  for (var i = 0; i < 500; i++) {
    var styles = `  -webkit-transform: translate3d(${(random(200) - 100)}vw, ${(random(100) - 50)}vh, 0) rotate(${random(360)}deg);
                    transform: translate3d(${(random(100) - 50)}vw, ${(random(100) - 50)}vh, 0) rotate(${random(360)}deg);
                    background: hsla(${random(360)},100%,50%,1);
                    animation: bang 1500ms ease forwards;
                    opacity: 0;
                    left:${random(2) > 1 ? "0" : "100%"};`;

    var e = document.createElement("i");
    e.style.cssText = styles.toString();
    c.appendChild(e);
    confettiCreated.push(e);
  }
  target.appendChild(c);
  window.setTimeout(() => {
    confettiCreated.forEach(elem => elem.parentNode.removeChild(elem));
    confettiCreated = [];
  }, 1700)

}

const Coupon = ({ code }) => {
  return (
    <div className="coupon-container slide-left">
      <div className="code">{code}</div>
      <div className="gift">{codeMap[code]}</div>
    </div>
  )
}

const Coupons = ({ codes }) => {
  if (codes.length === 0) {
    return <></>
  }
  return <>
  <div className="counter">{`${1+codes.length}/${1+ Object.keys(codeMap).length}`}</div>
  <div className="coupons">{
    codes.filter(x => codeMap.hasOwnProperty(x)).map(x => <Coupon key={x} code={x} />)
  }</div></>
}

const Timer = ({timer}) => {
  const labels = ["DAY","HOUR","MINUTE","SECOND"]
  return <div className="timer">
      {timer.map((x,i,a)=>{
        return <><div key={`a_${i}`} className="timer-box">
              <span>
                {x} 
              </span>
              <span>
                {labels[i] + (x==="01"?"":"S")}
              </span>
          </div>
          {
            i!==(a.length-1)?
            <div  key={`b_${i}`} className="timer-box"><span>{":"}</span><span></span></div> : <></>
          }
          
          </>
    })}
    </div>
}

const App = () => {

  const fetchFromLocalStorage = () => {
    try {
      if (window.localStorage.getItem("unlockedCodes") && JSON.parse(window.localStorage.getItem("unlockedCodes"))) {
        return JSON.parse(window.localStorage.getItem("unlockedCodes"));
      }
      return [];
    } catch (err) {
      if (typeof window.localStorage.getItem("unlockedCodes") === "string" && window.localStorage.getItem("unlockedCodes").includes(",")) {
        return window.localStorage.getItem("unlockedCodes").split(",");
      }
      return [];
    }
  }


  const [unlockedCodes, setUnlockedCodes] = useState(fetchFromLocalStorage());
  const [enteredCode, setEnteredCode] = useState("");
  const [timeLeft,setTimeLeft] = useState(0);
  const [timer, setTimer] = useState(["00","00","00","00"]); // dd/hh/mm/ss

  const countDownTill = "April 16, 2021 00:00:00";

  const timerUpdate = window.setInterval(()=>{
  setTimeLeft((new Date(countDownTill).getTime() - new Date().getTime()))
    if ( new Date(countDownTill).getTime() <= new Date().getTime() ) {
      window.clearInterval(timerUpdate);
    }
  },100)

  const getTimeLeft = timeLeft => {
    const addzeros = no=>(no>9?"":"0")+no;
    const oneday = 1000*60*60*24;
    let val = parseFloat(timeLeft/oneday);
    const dd = val <= 0 ? 0 : Math.floor(val);
    val = (val - dd) * 24;
    const hh = val <= 0 ? 0 : Math.floor(val);
    val = (val - hh) * 60;
    const mm = val <= 0 ? 0 : Math.floor(val);
    val = (val - mm) * 60;
    const ss = val <= 0 ? 0 : Math.floor(val);

    return [addzeros(dd),addzeros(hh),addzeros(mm),addzeros(ss)]

  }
  useEffect(()=>{
    setTimer(getTimeLeft(timeLeft));
  },[timeLeft])

  useEffect(() => {
    setEnteredCode("");
    window.localStorage.setItem("unlockedCodes", JSON.stringify(unlockedCodes))
    const target = document.getElementById("app-root")
    if (unlockedCodes.length) {
      createConfetti(target);
    }

  }, [unlockedCodes])

  const transformCode = str => str.replace(/[\W_]/g, "").toUpperCase();

  const handleCodeChange = newCode => {
    setEnteredCode(transformCode(newCode));
  }

  const handleSubmit = () => {
    if (!enteredCode) {
      alert(STATIC.NO_CODE)
    } else {
      if (!codeMap.hasOwnProperty(enteredCode)) {
        alert(STATIC.INVALID_CODE)
      }
      else if (unlockedCodes.includes(enteredCode)) {
        alert(STATIC.DUPLICATE_CODE)
      }
      else {
        setUnlockedCodes([...new Set([enteredCode, ...unlockedCodes])])
      }
    }
  }

  return (
    <div id="app-root" className="app">
      <header className="app-body">
        { timeLeft >= 0 ? 
          <Timer timer={timer}/>

          : <div className="redeem-title">
          <span className="redeem-text title">{STATIC.PAGE_TITLE}</span>
          <span className="redeem-text subtitle">{STATIC.PAGE_SUBTITLE}</span>
          <span className="reset-button" onClick={() => {
            if (window.confirm(STATIC.CONFIRM_RESET)) {
              setUnlockedCodes([]);
            }
          }}>
            <img src={resetSVG} alt="reset" className="reset" />
            <span className="hide-sm">{STATIC.RESET_BUTTON}</span>
          </span>
          <img src={couponSVG} alt="coupon" className="coupon" />
          <div className="responsive-flex">
            <input
              value={enteredCode}
              className="enter-code"
              onChange={e => { handleCodeChange(e.target.value) }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <button type="submit" className="submit-code" onClick={() => { handleSubmit(); }}>
              Submit
            </button>
          </div>  
          <Coupons codes={unlockedCodes} />
        </div>}

      </header>
    </div>
  );
}

export default App;

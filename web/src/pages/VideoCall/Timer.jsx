import React, { useEffect, useState, useRef } from "react";

export default function Timer({ timer, setTimer, timerStatus }) {

    const startTimer = useRef();

    const calculateTimeLeft = () => {    
      let difference = +new Date() - timerStatus;
      let timeLeft = [];
      const minuites = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)
      timeLeft['minuites'] = minuites < 10 ? `0${minuites}` : minuites;
      timeLeft['seconds'] = seconds < 10 ? `0${seconds}` : seconds;    
      return timeLeft;
    }
  
  
    useEffect(() => {
        if (timerStatus) {            
            setTimeout(() => {
                setTimer(calculateTimeLeft());
            }, 1000);
        }
    });  

    return (
        <div>
            {timer.minuites}:{timer.seconds}
        </div>
    )
}

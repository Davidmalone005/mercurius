import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const StorehouseTimer = ({ billing_starts }) => {
  const { flashsaleTimer, flashsaleTimerSwitch, setFlashsaleTimerSwitch } =
    useAppContext();

  const router = useRouter();

  const bs = new Date(billing_starts).getTime();

  const duration = bs - Date.now();

  const [time, setTime] = useState(duration);
  let remainingTime = "";

  const updateRemainingTime = (duration) => {
    let total_seconds = parseInt(Math.floor(duration / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));
    let total_hours = parseInt(Math.floor(total_minutes / 60));
    let total_days = parseInt(Math.floor(total_hours / 24));

    let seconds = parseInt(total_seconds % 60);
    let minutes = parseInt(total_minutes % 60);
    let hours = parseInt(total_hours % 24);

    let paddedSeconds = padWithZeros(seconds, 2);
    let paddedMinutes = padWithZeros(minutes, 2);
    let paddedHours = padWithZeros(hours, 2);
    let paddedDays = padWithZeros(total_days, 2);

    let returnedStatement = "";

    if (total_days === 0) {
      returnedStatement = `${paddedHours} : ${paddedMinutes} : ${paddedSeconds}`;
    } else {
      returnedStatement = `${paddedDays} : ${paddedHours} : ${paddedMinutes} : ${paddedSeconds}`;
    }

    if (total_days === 0 && total_hours === 0) {
      returnedStatement = `${paddedMinutes} : ${paddedSeconds}`;
    }

    return time < 0 ? setFlashsaleTimerSwitch(false) : returnedStatement;
  };

  const padWithZeros = (number, minLength) => {
    const numberString = number.toString();
    if (numberString.length >= minLength) return numberString;
    return "0".repeat(minLength - numberString.length) + numberString;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(time - 1000);
      updateRemainingTime(time);
    }, 1000);

      if (time < 0) {
        const options = {
          method: "POST",
          headers: { "Content-type": "application/json" },
        };

        fetch(
          "https://mercurius-backend.up.railway.app/api/inventory/f/disable/",
          options
        )
          .then((res) => res.json())
          .then((resData) => {});

        toast.error("Flash sales have ended!");

        setTimeout(() => {
          router.reload(window.location.pathname);
        }, 1000);
      }

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="ml-4 font-dalek font-bold text-lg">
      {updateRemainingTime(time)}
    </section>
  );
};

export default StorehouseTimer;

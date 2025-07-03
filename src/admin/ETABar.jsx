import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import dayjs from 'dayjs';

const ETABar = ({ createdAt, deliveryDays = 5 }) => {
  if (!createdAt?.toDate) return null;
  const orderDate = dayjs(createdAt.toDate());
  const now = dayjs();
  const daysPassed = now.diff(orderDate, 'day');
  const percent = Math.min((daysPassed / deliveryDays) * 100, 100);

  return (
    <div className="w-20 h-20">
      <CircularProgressbar
        value={percent}
        text={`${Math.max(deliveryDays - daysPassed, 0)}d`}
        styles={buildStyles({
          textColor: '#000',
          pathColor: '#10B981',
          trailColor: '#D1D5DB',
        })}
      />
      <p className="text-center mt-1 text-xs text-gray-500">ETA</p>
    </div>
  );
};

export default ETABar;
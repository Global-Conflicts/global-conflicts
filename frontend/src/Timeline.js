import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'
import { setTimelineStart, setTimelineEnd } from './redux/actions.js'

const selectSelectedStartDate = state => state.timeline.selectedStartDate;
const selectSelectedEndDate = state => state.timeline.selectedEndDate;
const selectMinDate = state => state.timeline.minDate;
const selectMaxDate = state => state.timeline.maxDate;

const dateToTimestamp = date => date.toLocaleDateString('en-CA');

function Timeline() {
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
  const minDate = useSelector(selectMinDate)
  const maxDate = useSelector(selectMaxDate)

  const onStartDateChange = useCallback(({ target }) => {
    setTimelineStart(new Date(target.value));
  });

  const onEndDateChange = useCallback(({ target }) => {
    setTimelineEnd(new Date(target.value));
  });

  return (
    <div className="timeline">
      <input 
        type="date"
        className="timeline__start-date-picker" 
        value={dateToTimestamp(startDate)}
        onChange={onStartDateChange}
        min={dateToTimestamp(minDate)} 
        max={dateToTimestamp(endDate)} 
      />
      <input 
        type="date"
        className="timeline__end-date-picker" 
        value={dateToTimestamp(endDate)}
        onChange={onEndDateChange}
        min={dateToTimestamp(startDate)} 
        max={dateToTimestamp(maxDate)}
      />
    </div>
  );
}

export default Timeline;

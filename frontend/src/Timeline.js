import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'
import { setTimelineStart, setTimelineEnd } from './redux/actions.js'

import TimeRange from 'react-timeline-range-slider'  

const selectSelectedStartDate = state => state.timeline.selectedStartDate;
const selectSelectedEndDate = state => state.timeline.selectedEndDate;
const selectMinDate = state => state.timeline.minDate;
const selectMaxDate = state => state.timeline.maxDate;

const dateToTimestamp = date => date.toLocaleDateString('en-CA');

const oneDay = 24 * 60 * 60 * 1000
const oneYear = new Date('2011') - new Date('2010');

function Timeline() {
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)

  const minDate = useSelector(selectMinDate)
  const maxDate = useSelector(selectMaxDate)

  const steps = Math.round(Math.abs((minDate - maxDate) / oneYear));

  const onStartDateChange = useCallback(({ target }) => {
    setTimelineStart(new Date(target.value));
  }, [setTimelineStart, setTimelineEnd]);

  const onEndDateChange = useCallback(({ target }) => {
    setTimelineEnd(new Date(target.value));
  }, [setTimelineStart, setTimelineEnd]);

  const onDateChange = useCallback((value) => {
    const { time } = value;
    const [startDate, endDate] = time;

    setTimelineStart(startDate);
    setTimelineEnd(endDate);
  }, [setTimelineStart, setTimelineEnd]);

  const onDateErrorUpdate = () => {};

  const formatTick = (ms) => new Date(ms).getFullYear();

  return (
    <div className="timeline">
      <input 
        type="date"
        className="timeline__date-picker" 
        value={dateToTimestamp(startDate)}
        onChange={onStartDateChange}
        min={dateToTimestamp(minDate)} 
        max={dateToTimestamp(endDate)} 
        required
      />
      <TimeRange
        ticksNumber={steps}
        formatTick={formatTick}
        step={oneDay}
        selectedInterval={[startDate, endDate]}
        timelineInterval={[minDate, maxDate]}
        onUpdateCallback={onDateChange}
        onChangeCallback={onDateErrorUpdate}
      />
      <input 
        type="date"
        className="timeline__date-picker" 
        value={dateToTimestamp(endDate)}
        onChange={onEndDateChange}
        min={dateToTimestamp(startDate)} 
        max={dateToTimestamp(maxDate)}
        required
      />
    </div>
  );
}

export default Timeline;

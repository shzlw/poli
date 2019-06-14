import React from 'react';
import PropTypes from 'prop-types';
import './DatePicker.css';

import * as Util from '../../api/Util';

class DatePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showDateSelectPanel: false
    };
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired
  };

  toggleDatePanel = () => {
    this.setState(prevState => ({
      showDateSelectPanel: !prevState.showDateSelectPanel
    })); 
  }

  previousMonth = () => {
    const { 
      name,
      value 
    } = this.props;
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const day = value.getDate();

    let newMonth;
    let newYear = year;
    if (month === 1) {
      newMonth = 12;
      newYear--;
    } else {
      newMonth = month - 1;
    }

    this.props.onChange(name, new Date(newYear, newMonth - 1, day));
  }

  nextMonth = () => {
    const { 
      name,
      value 
    } = this.props;
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const day = value.getDate();

    let newMonth;
    let newYear = year;
    if (month === 12) {
      newMonth = 1;
      newYear++;
    } else {
      newMonth = month + 1;
    }

    this.props.onChange(name, new Date(newYear, newMonth - 1, day));
  }

  selectDate = (day) => {
    const { 
      name,
      value 
    } = this.props;
    const year = value.getFullYear();
    const month = value.getMonth();
    this.props.onChange(name, new Date(year, month, day));
  }

  render() {
    const { showDateSelectPanel } = this.state;
    const { value } = this.props;
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const day = value.getDate();

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const CALENDAR_HEADERS = ['S', 'M', 'T', 'W', 'R', 'F', 'S'];
    const calendarHeaderCells = [];
    const calendarBodyCells = [];

    for (let i = 0; i < CALENDAR_HEADERS.length; i++) {
      calendarHeaderCells.push(
        <div className="calendar-cell header-cell" key={`header-${i}`}>{CALENDAR_HEADERS[i]}</div>
      );
    }

    for (let i = 0; i < firstDay.getDay(); i++) {
      calendarBodyCells.push(
        <div className="calendar-cell body-cell non-clickable" key={`before-${i}`}></div>
      );
    }

    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
      const activeClass = i === day ? 'cell-active' : '';
      calendarBodyCells.push(
        <div className={`calendar-cell body-cell clickable ${activeClass}`} onClick={() => this.selectDate(i)} key={`date-${i}`}>{i}</div>
      );
    }

    for (let i = lastDay.getDay() + 1; i <= 6; i++) {
      calendarBodyCells.push(
        <div className="calendar-cell body-cell non-clickable" key={`after-${i}`}></div>
      );
    }

    if (calendarBodyCells.length === 35) {
      for (let i = 0; i <= 6; i++) {
        calendarBodyCells.push(
          <div className="calendar-cell body-cell non-clickable" key={`empty-${i}`}></div>
        );
      }
    }

    const displayMonth = Util.leftPadZero(month);
    const displayDay = Util.leftPadZero(day);

    return (
      <div className="calendar-container">
        <div className="select-date" onClick={this.toggleDatePanel}>{year}-{displayMonth}-{displayDay}</div>
        { showDateSelectPanel && (
          <div className="calendar-dialog">
            <div>
              <div className="calendar-cell calendar-button" onClick={this.previousMonth}>Prev</div>
              <div className="display-date">{year}-{displayMonth}</div>
              <div className="calendar-cell calendar-button" onClick={this.nextMonth}>Next</div>
            </div>
            <div className="row">
              {calendarHeaderCells}
            </div>
            <div className="row">
              {calendarBodyCells}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DatePicker;
import './App.scss';
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"

import { useEffect, useState } from 'react';
import _ from 'lodash';

const defaultList = [{ text: '', selected: false }, { text: '', selected: false }, { text: '', selected: false }, { text: '', selected: false }, { text: '', selected: false }];
const defaultData = { story: '', date: new Date().toDateString(), todos: _.cloneDeep(defaultList), learnings: _.cloneDeep(defaultList) };

function App() {
  const [journalData, setJournalData] = useState(defaultData);

  useEffect(() => {
    getJournalDataForDate(new Date());
  }, []);

  const onChange = (path, value) => {
    // set journal data
    _.set(journalData, path, value);
    setJournalData(_.cloneDeep(journalData));

    // get and save to json
    const allData = JSON.parse(localStorage.getItem("yourDailyJournal")) || {};

    allData[journalData.date] = journalData;

    localStorage.setItem("yourDailyJournal", JSON.stringify(allData));
  }

  const goBack = () => {
    const newDate = new Date(journalData.date);
    newDate.setDate(newDate.getDate() - 1);

    getJournalDataForDate(newDate);
  }

  const getJournalDataForDate = (newDate) => {
    const allData = JSON.parse(localStorage.getItem("yourDailyJournal"))

    if (allData && allData[newDate.toDateString()]) {
      setJournalData(allData[newDate.toDateString()]);
    } else {
      const newJournal = _.cloneDeep(defaultData);
      newJournal.date = newDate.toDateString();
      setJournalData(newJournal);
    }
  }

  const goNext = () => {
    const newDate = new Date(journalData.date);
    newDate.setDate(newDate.getDate() + 1);

    getJournalDataForDate(newDate);
  }

  const { todos, learnings, date: journalDate } = journalData;

  return (
    <div className='journal-main w-full'>
      <div>My Daily Journal</div>
      <div className='flex gap-4 items-center text-xl mb-2'>
        <div className='cursor-pointer' onClick={goBack}><BsArrowLeft /></div>
        <div>{journalDate} </div>
        <div className='cursor-pointer' onClick={goNext}><BsArrowRight /></div>
      </div>
      <div className='w-[80%] min-w-[300px]'>
        <div className='pl-4 text-lg'>My Memories of this day</div>
        <textarea value={journalData.story} className="journal-textarea w-full" spellCheck="false" onChange={(e) => onChange('story', e.target.value)}></textarea>
      </div>
      <div className='flex justify-between w-full px-[10%] gap-7'>
        <div className='flex-1'>
          <div>Todo for today - </div>
          <div className='flex flex-col gap-1'>
            {todos.map((todo, idx) => {
              return (<div key={idx} className="flex items-center gap-1">
                <div onClick={() => {
                  onChange(`todos[${idx}].selected`, !todo.selected);
                }}> {todo.selected ? <GrCheckboxSelected /> : <GrCheckbox />} </div>
                <input value={todo.text} onChange={(e) => {
                  onChange(`todos[${idx}].text`, e.target.value);
                }}
                  className="border-b border-black w-full" />
              </div>)
            })}
          </div>
        </div>
        <div className='flex-1'>
          <div>What I learnt today - </div>
          <div className='flex flex-col gap-1'>
            {learnings.map((learning, idx) => {
              return (<div key={idx} className="flex items-center gap-1">
                <div onClick={() => {
                  onChange(`learnings[${idx}].selected`, !learning.selected);
                }}> {learning.selected ? <GrCheckboxSelected /> : <GrCheckbox />} </div>
                <input value={learning.text} onChange={(e) => {
                  onChange(`learnings[${idx}].text`, e.target.value);
                }} className="border-b border-black w-full" />
              </div>)
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

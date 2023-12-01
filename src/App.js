import { useState } from 'react'
import Show from './pages/Show';
import UploadFile from './pages/Upload';
import './App.css';


function App() {

  const [current, setCurrent] = useState('upload');
  const [data, setData] = useState([]);

  return (
    <div className="App">
      <UploadFile current={current} setCurrent={setCurrent} setData={setData} />
      <Show current={current} setCurrent={setCurrent} data={data} />
    </div>
  );
}

export default App;

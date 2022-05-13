// import logo from './logo.svg';
import './App.css';
// 创建“外壳”组件App
import React,{Component} from 'react';
import Hello from './components/Hello'
import Welcome from './components/Welcome'

//创建并且暴露App组件
export default class App extends Component {
  render() {
    return (
      <div>
        <Hello/>
        <Welcome />
      </div>
    )
  }
}



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

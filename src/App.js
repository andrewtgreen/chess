import './App.css';
import { Button } from 'react-native';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Chess Board
        </p>
        <Button color="beige" onPress={() => alert('button 1')} />

      </header>
    </div>
  );
}

export default App;

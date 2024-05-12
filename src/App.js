import './components/StockSearchBox'
import StockSearchBox from "./components/StockSearchBox";
import styles from "./css/App.module.css"

function App() {
  return (
    <div className={styles.app}>
        <StockSearchBox></StockSearchBox>
    </div>
  );
}

export default App;

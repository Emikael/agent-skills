import { createRoot } from 'react-dom/client';
import { Button } from './Button';
import './styles.css';

function App() {
  return (
    <main>
      <h1>Menu component playground</h1>
      <p>Use this page to exercise the new menu with pointer and keyboard.</p>
      <Button type="button">Existing button</Button>
      <section aria-label="Menu example">
        {/* Integrate the new dropdown here with enabled and disabled actions. */}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

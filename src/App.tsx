import { BookingHeader } from "./components/header/booking-header";
import { Toaster } from "./components/ui/toaster";
import Home from "./view/home";

// Función para retrasar la carga del módulo
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// const lazyWithDelay = (importFn: () => Promise<any>, delayMs: number) =>
//   delay(delayMs).then(() => importFn());

// Cargar el componente Home con un retraso de 3 segundos
// const Home = React.lazy(() => lazyWithDelay(() => import("./view/home"), 3000));

function App() {
  return (
    <div className="w-full h-screen overflow-hidden grid grid-rows-[auto_1fr] ">
      <Toaster />
      <BookingHeader />
      {/* Usar Suspense para mostrar un fallback mientras se carga el componente */}
      {/* <Suspense fallback={<LoaderSpinner />}> */}
        <Home />
      {/* </Suspense> */}
    </div>
  );
}

export default App;
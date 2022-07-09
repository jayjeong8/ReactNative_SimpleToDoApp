import {RecoilRoot} from 'recoil';
import TodoList from "./components/TodoList";



export default function App() {
  return (
    <RecoilRoot>
      <TodoList />
    </RecoilRoot>
  );
}

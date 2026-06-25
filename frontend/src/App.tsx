import axios from "@/axios/axios";
import { Button } from "@/components/ui/button";

function App() {
  async function handleClick() {
    const response = await axios.get("/health");
    console.log(response.data);
  }
  return (
    <>
      <Button onClick={handleClick}>Fetch Tasks</Button>
    </>
  );
}

export default App;

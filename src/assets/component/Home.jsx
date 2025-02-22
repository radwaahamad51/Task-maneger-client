
import Navbar from "./navber";
import TaskBoard from "./taskboard";

const Home = () =>{
    return(
        <div>
            <Navbar></Navbar>
        <div className="mt-20">
        <TaskBoard></TaskBoard>
        </div>
        </div>
    )
};
export default Home;